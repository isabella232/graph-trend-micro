import {
  Recording,
  setupRecording,
  createMockStepExecutionContext,
} from 'test';

import step, { createAdministratorRoleEntity } from '../index';
import {
  createDeepSecurityClient,
  DeepSecurityAdministratorRole,
} from '../../../provider';

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
  const context = createMockStepExecutionContext();
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
      }),
    ]),
  });
});

test('administator entity conversion', async () => {
  const role = {
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
    description: '',
    _key: 'urn:tmds:identity:us-east-ds-1:78422:role/New Role_2',
    _type: 'trend_micro_administrator_role',
    _class: ['AccessRole'],
    createdOn: undefined,
    displayName: 'New Role_2',
    _rawData: [{ name: 'default', rawData: expect.objectContaining(role) }],
  });
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext();
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities).toHaveLength(4);
  expect(context.jobState.collectedRelationships).toHaveLength(0);

  expect(context.jobState.collectedEntities).toEqual([
    expect.objectContaining({
      _key: 'urn:tmds:identity:us-east-ds-1:78422:role/Full Access',
    }),
    expect.objectContaining({
      _key: 'urn:tmds:identity:us-east-ds-1:78422:role/Auditor',
    }),
    expect.objectContaining({
      _key: 'urn:tmds:identity:us-east-ds-1:78422:role/New Role',
    }),
    expect.objectContaining({
      _key: 'urn:tmds:identity:us-east-ds-1:78422:role/New Role_2',
    }),
  ]);
});
