import { createMockStepExecutionContext } from 'test';

import step from '../index';

import entities from './__fixtures__/entities.json';

test('step data collection', async () => {
  const context = createMockStepExecutionContext({ entities });
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities).toHaveLength(0);
  expect(context.jobState.collectedRelationships).toHaveLength(2);

  expect(context.jobState.collectedRelationships).toEqual([
    expect.objectContaining({
      _key:
        'trend-micro-administrator:1|assigned|urn:tmds:identity:us-east-ds-1:78422:role/Full Access',
      _type: 'trend_micro_administrator_assigned_role',
      _class: 'ASSIGNED',
      _fromEntityKey: 'trend-micro-administrator:1',
      _toEntityKey: 'urn:tmds:identity:us-east-ds-1:78422:role/Full Access',
    }),
    expect.objectContaining({
      _key:
        'trend-micro-administrator:8|assigned|urn:tmds:identity:us-east-ds-1:78422:role/Auditor',
      _type: 'trend_micro_administrator_assigned_role',
      _class: 'ASSIGNED',
      _fromEntityKey: 'trend-micro-administrator:8',
      _toEntityKey: 'urn:tmds:identity:us-east-ds-1:78422:role/Auditor',
    }),
  ]);
});
