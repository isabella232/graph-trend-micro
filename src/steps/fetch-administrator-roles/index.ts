import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk';

import {
  createDeepSecurityClient,
  DeepSecurityAdministratorRole,
} from '../../provider';

export const STEP_ID = 'fetch-administrator-roles';
export const ROLE_TYPE = 'trend_micro_administrator_role';

const step: IntegrationStep = {
  id: STEP_ID,
  name: 'Fetch administrator roles',
  types: [ROLE_TYPE],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createDeepSecurityClient(instance);

    const { roles } = await client.listAdministratorRoles();

    await jobState.addEntities(roles.map(createAdministratorRoleEntity));
  },
};

export default step;

export function createAdministratorRoleEntity(
  role: DeepSecurityAdministratorRole,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: role,
      assign: {
        _key: role.urn,
        _type: ROLE_TYPE,
        _class: 'AccessRole',
        id: role.ID.toString(), // must cast to string to match data model
        // normalize property names to match data model
        name: role.name || role.urn,
      },
    },
  });
}
