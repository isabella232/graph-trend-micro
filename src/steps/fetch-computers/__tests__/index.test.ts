import {
  Recording,
  setupRecording,
  createMockStepExecutionContext,
} from 'test';

import step, { createComputerEntity } from '../index';
import {
  createDeepSecurityClient,
  DeepSecurityComputer,
} from '../../../provider';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'computers',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('computer fetching', async () => {
  const context = createMockStepExecutionContext();
  const provider = createDeepSecurityClient(context.instance);

  const results = await provider.listComputers();

  expect(results).toEqual({
    computers: expect.arrayContaining([
      expect.objectContaining({
        hostName: 'ec2-54-187-35-33.us-west-2.compute.amazonaws.com',
        description:
          "This computer is a demonstration of Deep Security's capabilities. Open a browser to http://ec2-54-187-35-33.us-west-2.compute.amazonaws.com for more information.",
        policyID: 3,
        agentVersion: '11.1.0.163',
        platform: 'Amazon Linux (64 bit) (4.14.62-65.117.amzn1.x86_64)',
        relayListID: 0,
        agentFingerPrint:
          'F9:51:AE:21:1F:7E:08:91:D2:5A:3D:4D:0D:17:F3:53:E9:EA:4E:28',
        biosUUID: 'ec29a088-a562-cdad-48d9-d76b0e3385c4',
        hostGUID: '6BE38408-DA9E-4A03-1EB4-5CE824AD0C58',
        ID: 1,
      }),
      expect.objectContaining({
        hostName: '172.31.121.120',
        displayName: 'i-075776bd5b0b322aa',
        description: '',
        groupID: 79,
        agentVersion: '0.0.0.0',
        platform: 'Amazon Linux (64 bit)',
        relayListID: 0,
        hostGUID: 'FBA83AE4-7389-6448-F6E5-12E326BEBDBA',
        ID: 34,
      }),
      expect.objectContaining({
        hostName: '172.31.211.111',
        displayName: 'i-0dca1d41741a0a411',
        description: '',
        agentVersion: '0.0.0.0',
        platform: 'Amazon Linux (64 bit)',
        groupID: 79,
        relayListID: 0,
        hostGUID: '258AC077-4A7D-F72B-676B-36568A9F8932',
        ID: 35,
      }),
    ]),
  });
});

test('computer entity conversion', async () => {
  const computer = {
    hostName: 'ec2-54-187-35-33.us-west-2.compute.amazonaws.com',
    description:
      "This computer is a demonstration of Deep Security's capabilities. Open a browser to http://ec2-54-187-35-33.us-west-2.compute.amazonaws.com for more information.",
    policyID: 3,
    agentVersion: '11.1.0.163',
    platform: 'Amazon Linux (64 bit) (4.14.62-65.117.amzn1.x86_64)',
    relayListID: 0,
    agentFingerPrint:
      'F9:51:AE:21:1F:7E:08:91:D2:5A:3D:4D:0D:17:F3:53:E9:EA:4E:28',
    biosUUID: 'ec29a088-a562-cdad-48d9-d76b0e3385c4',
    hostGUID: '6BE38408-DA9E-4A03-1EB4-5CE824AD0C58',
    groupID: 25,
    ID: 1,
  } as DeepSecurityComputer;

  expect(createComputerEntity(computer)).toEqual({
    _key: 'trend-micro-computer:1',
    _type: 'trend_micro_computer',
    _class: ['Host'],
    name: 'ec2-54-187-35-33.us-west-2.compute.amazonaws.com',
    displayName: 'ec2-54-187-35-33.us-west-2.compute.amazonaws.com',
    hostname: 'ec2-54-187-35-33.us-west-2.compute.amazonaws.com',
    platform: 'linux',
    groupId: '25',
    description:
      "This computer is a demonstration of Deep Security's capabilities. Open a browser to http://ec2-54-187-35-33.us-west-2.compute.amazonaws.com for more information.",
    _rawData: [
      {
        name: 'default',
        rawData: computer,
      },
    ],
  });
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext();
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities).toHaveLength(3);
  expect(context.jobState.collectedRelationships).toHaveLength(0);

  expect(context.jobState.collectedEntities).toEqual([
    expect.objectContaining({
      _key: 'trend-micro-computer:1',
    }),
    expect.objectContaining({
      _key: 'trend-micro-computer:34',
    }),
    expect.objectContaining({
      _key: 'trend-micro-computer:35',
    }),
  ]);
});
