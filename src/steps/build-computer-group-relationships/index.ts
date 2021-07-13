import {
  Entity,
  Relationship,
  JobState,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { STEP_ID as COMPUTER_STEP, COMPUTER_TYPE } from '../fetch-computers';
import {
  STEP_ID as COMPUTER_GROUP_STEP,
  COMPUTER_GROUP_TYPE,
} from '../fetch-computer-groups';

const step: IntegrationStep = {
  id: 'build-computer-group-relationships',
  name: 'Build computer group relationships',
  entities: [],
  relationships: [
    {
      _type: 'trend_micro_computer_has_group',
      sourceType: COMPUTER_GROUP_TYPE,
      _class: RelationshipClass.HAS,
      targetType: COMPUTER_TYPE,
    },
  ],
  dependsOn: [COMPUTER_STEP, COMPUTER_GROUP_STEP],
  async executionHandler({ jobState }: IntegrationStepExecutionContext) {
    const groupIdMap = await createComputerGroupIdMap(jobState);

    await jobState.iterateEntities(
      { _type: COMPUTER_TYPE },
      async (computer) => {
        const group = groupIdMap.get(computer.groupId as string);

        if (group) {
          const relationship = createComputerGroupRelationship(computer, group);
          await jobState.addRelationships([relationship]);
        }
      },
    );
  },
};

async function createComputerGroupIdMap(
  jobState: JobState,
): Promise<Map<string, Entity>> {
  const groupIdMap = new Map<string, Entity>();
  await jobState.iterateEntities({ _type: COMPUTER_GROUP_TYPE }, (group) => {
    // unfortunately need to cast because of EntityPropertyValue type
    groupIdMap.set(group.id as string, group);
  });
  return groupIdMap;
}

export default step;

export function createComputerGroupRelationship(
  computer: Entity,
  group: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: computer,
    to: group,
  });
}
