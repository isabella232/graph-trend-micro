import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk';

import {
  createDeepSecurityClient,
  DeepSecurityComputerGroup,
} from '../../provider';

const COMPUTER_GROUP_TYPE = 'trend_micro_computer_group';

const step: IntegrationStep = {
  id: 'fetch-computer-groups',
  name: 'Fetch computer groups',
  types: [COMPUTER_GROUP_TYPE],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createDeepSecurityClient(instance);

    const { computerGroups } = await client.listComputerGroups();

    await jobState.addEntities(computerGroups.map(createComputerGroupEntity));
  },
};

export default step;

export function createComputerGroupEntity(
  group: DeepSecurityComputerGroup,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: group,
      assign: {
        _key: createComputerGroupEntityIdentifier(group),
        _type: COMPUTER_GROUP_TYPE,
        _class: 'Group',
        parentGroupID: group.parentGroupID,
        cloudType: group.cloudType,
        amazonSubnetID: group.amazonSubnetID,
        type: group.type,
      },
    },
  });
}

/**
 * DO NOT change this constant. IDs are not long enough
 * to generate keys that match the min length
 * the data model requires
 */
const COMPUTER_GROUP_ID_PREFIX = 'trend-micro-computer-group';
function createComputerGroupEntityIdentifier(
  group: DeepSecurityComputerGroup,
): string {
  return `${COMPUTER_GROUP_ID_PREFIX}:${group.ID}`;
}
