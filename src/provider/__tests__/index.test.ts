import { createDeepSecurityClient } from '../index';

test('creates a DeepSecurityClient using the api key from the integration instance', () => {
  const client = createDeepSecurityClient({
    id: 'test-integration-instance',
    accountId: 'Your account',
    name: 'Test Integration',
    integrationDefinitionId: 'test-integration-definition',
    description: 'A generated integration instance just for this test',
    config: {
      apiKey: 'my-api-key',
    },
  });

  expect(client.requiredHeaders).toEqual({
    'api-secret-key': 'my-api-key',
    'api-version': 'v1',
  });
});
