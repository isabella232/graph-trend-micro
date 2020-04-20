import { Polly, setupPolly, createStepContext } from 'test';

import step from '../index';

let polly: Polly;

afterEach(async () => {
  await polly.stop();
});

test('should fetch api keys and generate entities from the results', async () => {
  polly = setupPolly(__dirname, 'api-keys');

  const context = createStepContext();
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities).toHaveLength(3);
  expect(context.jobState.collectedRelationships).toHaveLength(0);

  expect(context.jobState.collectedEntities).toEqual([
    expect.objectContaining({
      _class: ['Key'],
      _type: 'trend_micro_api_key',
      _key: 'trend-micro-api-key:2',
      name: 'jupiterone-test',
      active: true,
      displayName: 'jupiterone-test',
      description: 'Test api key for integration',
    }),
    expect.objectContaining({
      _class: ['Key'],
      _type: 'trend_micro_api_key',
      _key: 'trend-micro-api-key:3',
      active: true,
      name: 'view-only',
      displayName: 'view-only',
      description: '',
    }),
    expect.objectContaining({
      _class: ['Key'],
      _type: 'trend_micro_api_key',
      _key: 'trend-micro-api-key:4',
      active: true,
      name: 'Full access',
      displayName: 'Full access',
      description: '',
    }),
  ]);
});
