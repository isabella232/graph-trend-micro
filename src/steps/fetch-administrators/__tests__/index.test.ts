import { Recording, setupRecording, createStepContext } from 'test';

import step, { createAdministratorEntity } from '../index';
import {
  createDeepSecurityClient,
  DeepSecurityAdministrator,
} from '../../../provider';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'administrators',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('administrator fetching', async () => {
  const context = createStepContext();
  const provider = createDeepSecurityClient(context.instance);

  const results = await provider.listAdministrators();

  expect(results).toEqual({
    administrators: expect.arrayContaining([
      expect.objectContaining({
        username: 'charlie.duong@jupiterone.io',
        fullName: '',
        description: '',
        roleID: 1,
        locale: 'en-US',
        timeZone: 'US/Eastern',
        timeFormat: '24',
        passwordNeverExpires: true,
        active: true,
        mfaType: 'none',
        phoneNumber: '',
        mobileNumber: '',
        pagerNumber: '',
        emailAddress: 'charlie.duong@jupiterone.io',
        primaryContact: true,
        receiveNotifications: false,
        reportPDFPasswordEnabled: false,
        created: 1586982455921,
        lastPasswordChange: 1586982455921,
        lastSignIn: 1587488991381,
        unsuccessfulSignInAttempts: 0,
        external: false,
        type: 'normal',
        readOnly: false,
        ID: 1,
        UTCOffset: 'UTC-4.00, DST',
      }),
      expect.objectContaining({
        username: 'charlie.duong.test',
        fullName: 'Charlie Test',
        description: 'Testing123',
        roleID: 2,
        locale: 'en-US',
        timeZone: 'US/Eastern',
        timeFormat: '24',
        passwordNeverExpires: false,
        active: true,
        mfaType: 'none',
        phoneNumber: '',
        mobileNumber: '',
        pagerNumber: '',
        emailAddress: '',
        primaryContact: false,
        receiveNotifications: false,
        reportPDFPasswordEnabled: false,
        created: 1587489647292,
        lastPasswordChange: 1587489647292,
        lastSignIn: 1587489661720,
        unsuccessfulSignInAttempts: 0,
        external: false,
        type: 'normal',
        readOnly: false,
        ID: 8,
        UTCOffset: 'UTC-4.00, DST',
      }),
    ]),
  });
});

test('administator entity conversion', async () => {
  const admin = {
    username: 'charlie.duong.test',
    fullName: 'Charlie Test',
    description: 'Testing123',
    roleID: 2,
    locale: 'en-US',
    timeZone: 'US/Eastern',
    timeFormat: '24',
    passwordNeverExpires: false,
    active: true,
    mfaType: 'none',
    phoneNumber: '',
    mobileNumber: '',
    pagerNumber: '',
    emailAddress: '',
    primaryContact: false,
    receiveNotifications: false,
    reportPDFPasswordEnabled: false,
    created: 1587489647292,
    lastPasswordChange: 1587489647292,
    lastSignIn: 1587489661720,
    unsuccessfulSignInAttempts: 0,
    external: false,
    type: 'normal',
    readOnly: false,
    ID: 8,
    UTCOffset: 'UTC-4.00, DST',
  } as DeepSecurityAdministrator;

  expect(createAdministratorEntity(admin)).toEqual({
    description: 'Testing123',
    active: true,
    _key: 'trend-micro-administator:8',
    _type: 'trend_micro_administrator',
    _class: ['User'],
    name: 'Charlie Test',
    createdOn: 1587489647292,
    username: 'charlie.duong.test',
    _rawData: [
      {
        name: 'default',
        rawData: admin,
      },
    ],
    displayName: 'Charlie Test',
  });
});

test('step data collection', async () => {
  const context = createStepContext();
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities).toHaveLength(2);
  expect(context.jobState.collectedRelationships).toHaveLength(0);

  expect(context.jobState.collectedEntities).toEqual([
    expect.objectContaining({
      _key: 'trend-micro-administator:1',
    }),
    expect.objectContaining({
      _key: 'trend-micro-administator:8',
    }),
  ]);
});
