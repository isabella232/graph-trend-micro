import {
  Recording,
  setupRecording,
  createMockStepExecutionContext,
} from '../../../../test';

import step, { createAdministratorRoleEntity } from '../index';
import {
  createDeepSecurityClient,
  DeepSecurityAdministratorRole,
} from '../../../provider';
import { TrendMicroIntegrationConfig } from '../../../types';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'administratorRoles',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('administratorRole fetching', async () => {
  const context = createMockStepExecutionContext<TrendMicroIntegrationConfig>({
    instanceConfig: {
      apiKey: 'apiKey',
    },
  });
  const provider = createDeepSecurityClient(context.instance);

  const results = await provider.listAdministratorRoles();

  expect(results).toEqual({
    roles: expect.arrayContaining([
      expect.objectContaining({
        name: 'Full Access',
        description: '',
        urn: 'urn:tmds:identity:us-east-ds-1:78422:role/Full Access',
        immutable: true,
        canOnlyManipulateUsersWithEqualOrLesserRights: false,
        allComputers: true,
        allPolicies: true,
        allowUserInterface: true,
        allowWebService: true,
        ID: 1,
      }),
      expect.objectContaining({
        name: 'Auditor',
        description: '',
        urn: 'urn:tmds:identity:us-east-ds-1:78422:role/Auditor',
        immutable: false,
        canOnlyManipulateUsersWithEqualOrLesserRights: false,
        allComputers: true,
        allPolicies: true,
        allowUserInterface: true,
        allowWebService: true,
        ID: 2,
      }),
      expect.objectContaining({
        name: 'New Role',
        description: '',
        urn: 'urn:tmds:identity:us-east-ds-1:78422:role/New Role',
        immutable: false,
        canOnlyManipulateUsersWithEqualOrLesserRights: false,
        allComputers: true,
        allPolicies: true,
        allowUserInterface: true,
        allowWebService: false,
        ID: 3,
      }),
      expect.objectContaining({
        name: 'New Role_2',
        description: '',
        urn: 'urn:tmds:identity:us-east-ds-1:78422:role/New Role_2',
        immutable: false,
        canOnlyManipulateUsersWithEqualOrLesserRights: false,
        allComputers: true,
        allPolicies: true,
        allowUserInterface: true,
        allowWebService: false,
        ID: 4,
      }),
    ]),
  });
});

test('administator role entity conversion', () => {
  const role = {
    ID: 4,
    name: 'New Role_2',
    description: '',
    urn: 'urn:tmds:identity:us-east-ds-1:78422:role/New Role_2',
    immutable: false,
    canOnlyManipulateUsersWithEqualOrLesserRights: false,
    allComputers: true,
    allPolicies: true,
    allowUserInterface: true,
    allowWebService: false,
  } as DeepSecurityAdministratorRole;

  expect(createAdministratorRoleEntity(role)).toEqual({
    name: 'New Role_2',
    id: 'trend-micro-administrator-role:4',
    description: '',
    urn: 'urn:tmds:identity:us-east-ds-1:78422:role/New Role_2',
    _key: 'trend-micro-administrator-role:4',
    _type: 'trend_micro_administrator_role',
    _class: ['AccessRole'],
    createdOn: undefined,
    displayName: 'New Role_2',
    _rawData: [{ name: 'default', rawData: expect.objectContaining(role) }],
  });
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext<TrendMicroIntegrationConfig>({
    instanceConfig: {
      apiKey: 'apiKey',
    },
  });
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities).toHaveLength(4);
  expect(context.jobState.collectedRelationships).toHaveLength(0);

  expect(context.jobState.collectedEntities).toEqual([
    expect.objectContaining({
      _key: 'trend-micro-administrator-role:1',
    }),
    expect.objectContaining({
      _key: 'trend-micro-administrator-role:2',
    }),
    expect.objectContaining({
      _key: 'trend-micro-administrator-role:3',
    }),
    expect.objectContaining({
      _key: 'trend-micro-administrator-role:4',
    }),
  ]);
});
