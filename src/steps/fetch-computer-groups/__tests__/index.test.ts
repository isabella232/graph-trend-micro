import {
  Recording,
  setupRecording,
  createMockStepExecutionContext,
} from '../../../../test';

import step, { createComputerGroupEntity } from '../index';
import {
  createDeepSecurityClient,
  DeepSecurityComputerGroup,
} from '../../../provider';
import { TrendMicroIntegrationConfig } from '../../../types';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'computer-groups',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('computer group fetching', async () => {
  const context = createMockStepExecutionContext<TrendMicroIntegrationConfig>({
    instanceConfig: {
      apiKey: 'apiKey',
    },
  });
  const provider = createDeepSecurityClient(context.instance);

  const results = await provider.listComputerGroups();

  expect(results).toEqual({
    computerGroups: expect.arrayContaining([
      expect.objectContaining({
        type: 'aws-subnet',
        name: 'subnet-ed0c7888',
        cloudType: 'amazon',
        parentGroupID: 74,
        amazonSubnetID: 43,
        ID: 76,
      }),
      expect.objectContaining({
        type: 'aws-subnet',
        name: 'subnet-ccb21c95',
        cloudType: 'amazon',
        parentGroupID: 74,
        amazonSubnetID: 44,
        ID: 77,
      }),
      expect.objectContaining({
        type: 'aws-subnet',
        name: 'deepsecurity (subnet-09eb438f49fbf5900)',
        cloudType: 'amazon',
        parentGroupID: 66,
        amazonSubnetID: 46,
        ID: 79,
      }),
    ]),
  });
});

test('computer entity conversion', async () => {
  const group = {
    type: 'aws-subnet',
    name: 'subnet-ed0c7888',
    cloudType: 'amazon',
    parentGroupID: 74,
    amazonSubnetID: 43,
    ID: 76,
  } as DeepSecurityComputerGroup;

  expect(createComputerGroupEntity(group)).toEqual({
    _key: 'trend-micro-computer-group:76',
    _type: 'trend_micro_computer_group',
    _class: ['Group'],
    type: 'aws-subnet',
    cloudType: 'amazon',
    parentGroupId: 'trend-micro-computer-group:74',
    amazonSubnetId: 'trend-micro-computer-group:43',
    name: 'subnet-ed0c7888',
    displayName: 'subnet-ed0c7888',
    id: 'trend-micro-computer-group:76',
    _rawData: [
      {
        name: 'default',
        rawData: group,
      },
    ],
  });
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext<TrendMicroIntegrationConfig>({
    instanceConfig: {
      apiKey: 'apiKey',
    },
  });
  await step.executionHandler(context);

  const client = createDeepSecurityClient(context.instance);

  expect(context.jobState.collectedEntities).toHaveLength(79);
  expect(context.jobState.collectedRelationships).toHaveLength(0);

  const { computerGroups } = await client.listComputerGroups();

  expect(context.jobState.collectedEntities).toEqual(
    expect.arrayContaining(
      computerGroups.map(({ ID }) =>
        expect.objectContaining({
          _key: `trend-micro-computer-group:${ID}`,
        }),
      ),
    ),
  );
});
