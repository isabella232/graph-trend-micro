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

const ROLE_TYPE = 'trend_micro_administrator_role';

const step: IntegrationStep = {
  id: 'fetch-administrator-roles',
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

        // normalize property names to match data model
        name: role.name || role.urn,
      },
    },
  });
}
