import {
  Recording,
  setupRecording,
  createMockStepExecutionContext,
} from '../../../../test';

import step, { createApiKeyEntity } from '../index';
import {
  createDeepSecurityClient,
  DeepSecurityApiKey,
} from '../../../provider';
import { TrendMicroIntegrationConfig } from '../../../types';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'api-keys',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('api key fetching', async () => {
  // NOTE: provider api is kind of strange and
  // just returns _all_ api keys
  // and has no support for paging
  //
  // ref: https://automation.deepsecurity.trendmicro.com/article/dsaas/api-reference?platform=dsaas#operation/listApiKeys
  const context = createMockStepExecutionContext<TrendMicroIntegrationConfig>({
    instanceConfig: {
      apiKey: 'apiKey',
    },
  });
  const provider = createDeepSecurityClient(context.instance);

  const results = await provider.listApiKeys();

  expect(results).toEqual({
    apiKeys: expect.arrayContaining([
      expect.objectContaining({
        keyName: 'jupiterone-test',
        description: 'Test api key for integration',
        roleID: 2,
        ID: 2,
        active: true,
        serviceAccount: false,
      }),
      expect.objectContaining({
        keyName: 'view-only',
        description: '',
        roleID: 3,
        ID: 3,
        active: true,
        serviceAccount: false,
      }),
      expect.objectContaining({
        keyName: 'Full access',
        description: '',
        roleID: 1,
        ID: 4,
        active: true,
        serviceAccount: false,
      }),
    ]),
  });
});

test('api key entity conversion', async () => {
  const apiKey = {
    keyName: 'jupiterone-test',
    description: 'Test api key for integration',
    locale: 'en-US',
    roleID: 2,
    timeZone: 'US/Eastern',
    active: true,
    created: 1586982900004,
    unsuccessfulSignInAttempts: 0,
    serviceAccount: false,
    ID: 2,
  } as DeepSecurityApiKey;

  expect(createApiKeyEntity(apiKey)).toEqual({
    description: 'Test api key for integration',
    active: true,
    _key: 'trend-micro-api-key:2',
    _type: 'trend_micro_api_key',
    _class: ['Key'],
    name: 'jupiterone-test',
    createdOn: 1586982900004,
    id: 'trend-micro-api-key:2',
    _rawData: [
      {
        name: 'default',
        rawData: apiKey,
      },
    ],
    displayName: 'jupiterone-test',
  });
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext<TrendMicroIntegrationConfig>({
    instanceConfig: {
      apiKey: 'apiKey',
    },
  });
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities).toHaveLength(3);
  expect(context.jobState.collectedRelationships).toHaveLength(0);

  expect(context.jobState.collectedEntities).toEqual([
    expect.objectContaining({
      _key: 'trend-micro-api-key:2',
    }),
    expect.objectContaining({
      _key: 'trend-micro-api-key:3',
    }),
    expect.objectContaining({
      _key: 'trend-micro-api-key:4',
    }),
  ]);
});
