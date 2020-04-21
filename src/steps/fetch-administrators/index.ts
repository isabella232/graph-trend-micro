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

export const STEP_ID = 'fetch-administrators';
export const ADMIN_TYPE = 'trend_micro_administrator';

const step: IntegrationStep = {
  id: STEP_ID,
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

        roleID: administrator.roleID,
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
const ADMIN_ID_PREFIX = 'trend-micro-administrator';
function createAdministratorEntityIdentifier(
  administrator: DeepSecurityAdministrator,
): string {
  return `${ADMIN_ID_PREFIX}:${administrator.ID}`;
}
