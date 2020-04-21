import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk';

import { createDeepSecurityClient, DeepSecurityApiKey } from '../../provider';

const API_KEY_TYPE = 'trend_micro_api_key';

const step: IntegrationStep = {
  id: 'fetch-api-keys',
  name: 'Fetch API Keys',
  types: [API_KEY_TYPE],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createDeepSecurityClient(instance);

    const { apiKeys } = await client.listApiKeys();

    await jobState.addEntities(apiKeys.map(createApiKeyEntity));
  },
};

export default step;

export function createApiKeyEntity(apiKey: DeepSecurityApiKey): Entity {
  return createIntegrationEntity({
    entityData: {
      source: apiKey,
      assign: {
        _key: createApiKeyEntityIdentifier(apiKey),
        _type: API_KEY_TYPE,
        _class: 'Key',

        // normalize property names to match data model
        name: apiKey.keyName,
        createdOn: apiKey.created,
      },
    },
  });
}

/**
 * DO NOT change this constant. IDs are not long enough
 * to generate keys that match the min length
 * the data model requires
 */
const API_KEY_ID_PREFIX = 'trend-micro-api-key';
function createApiKeyEntityIdentifier(apiKey: DeepSecurityApiKey): string {
  return `${API_KEY_ID_PREFIX}:${apiKey.ID}`;
}
