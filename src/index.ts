import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk';

import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';

import buildAdminRoleRelationships from './steps/build-administrator-role-relationships';
import buildComputerGroupRelationships from './steps/build-computer-group-relationships';
import fetchAdministrators from './steps/fetch-administrators';
import fetchAdministratorRoles from './steps/fetch-administrator-roles';
import fetchApiKeys from './steps/fetch-api-keys';
import fetchComputers from './steps/fetch-computers';
import fetchComputerGroups from './steps/fetch-computer-groups';

export const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [
    buildAdminRoleRelationships,
    buildComputerGroupRelationships,
    fetchAdministrators,
    fetchAdministratorRoles,
    fetchApiKeys,
    fetchComputers,
    fetchComputerGroups,
  ],
};
