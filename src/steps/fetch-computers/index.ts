import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk';

import { createDeepSecurityClient, DeepSecurityComputer } from '../../provider';

export const STEP_ID = 'fetch-computers';
export const COMPUTER_TYPE = 'trend_micro_computer';

const step: IntegrationStep = {
  id: STEP_ID,
  name: 'Fetch computers',
  types: [COMPUTER_TYPE],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createDeepSecurityClient(instance);

    const { computers } = await client.listComputers();

    await jobState.addEntities(computers.map(createComputerEntity));
  },
};

export default step;

export function createComputerEntity(computer: DeepSecurityComputer): Entity {
  return createIntegrationEntity({
    entityData: {
      source: computer,
      assign: {
        _key: createComputerEntityIdentifier(computer),
        _type: COMPUTER_TYPE,
        _class: 'Host',

        // normalize property names to match data model
        createdOn: computer.created,
        name: computer.displayName || computer.hostName,
        hostname: computer.hostName,
        platform: extractPlatform(computer.platform),
        groupID: computer.groupID,
      },
    },
  });
}

/**
 * DO NOT change this constant. IDs are not long enough
 * to generate keys that match the min length
 * the data model requires
 */
const COMPUTER_ID_PREFIX = 'trend-micro-computer';
function createComputerEntityIdentifier(
  computer: DeepSecurityComputer,
): string {
  return `${COMPUTER_ID_PREFIX}:${computer.ID}`;
}

/**
 * This regular expression is used to extract the platform name
 * that matches our data model from the string returned by the
 * computer api
 */
const PLATFORM_REGEX = /(darwin|linux|unix|windows|android|ios|embedded)/i;
function extractPlatform(platform: string): string {
  const [match] = platform.match(PLATFORM_REGEX);
  return match ? match.toLowerCase() : 'other';
}
