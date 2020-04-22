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

export const STEP_ID = 'fetch-computer-groups';
export const COMPUTER_GROUP_TYPE = 'trend_micro_computer_group';

const step: IntegrationStep = {
  id: STEP_ID,
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
        // NOTE: Some of the entities collected through this may seem
        // like they really should be part of the Network class
        // since they contain subnet ids
        // but there isn't enough information returned to actually
        // fulfill the requirements to fit that in the data model.
        //
        // Also not all computer groups returned are subnets.
        // An AWS account group may be returned from the API
        // if an AWS Connector was setup.
        //
        // So for now we will consider computerGroups as
        // generic Group entities.
        _class: 'Group',
        parentGroupID: group.parentGroupID,
        cloudType: group.cloudType,
        amazonSubnetID: group.amazonSubnetID,
        type: group.type,
        ID: group.ID,
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
