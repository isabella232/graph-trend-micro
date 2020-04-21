import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk';

import {
  createDeepSecurityClient,
  DeepSecurityAdministrator,
} from '../../provider';

const ADMIN_TYPE = 'trend_micro_administrator';

const step: IntegrationStep = {
  id: 'fetch-administrators',
  name: 'Fetch administrators',
  types: [ADMIN_TYPE],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createDeepSecurityClient(instance);

    const { administrators } = await client.listAdministrators();

    await jobState.addEntities(administrators.map(createAdministratorEntity));
  },
};

export default step;

export function createAdministratorEntity(
  administrator: DeepSecurityAdministrator,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: administrator,
      assign: {
        _key: createAdministratorEntityIdentifier(administrator),
        _type: ADMIN_TYPE,
        _class: 'User',

        // normalize property names to match data model
        name: administrator.fullName || administrator.username,
        createdOn: administrator.created,
      },
    },
  });
}

/**
 * DO NOT change this constant. IDs are not long enough
 * to generate keys that match the min length
 * the data model requires
 */
const API_KEY_ID_PREFIX = 'trend-micro-administator';
function createAdministratorEntityIdentifier(
  administrator: DeepSecurityAdministrator,
): string {
  return `${API_KEY_ID_PREFIX}:${administrator.ID}`;
}
