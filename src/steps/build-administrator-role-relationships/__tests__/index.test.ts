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
        'trend-micro-administrator:1|assigned|trend-micro-administrator-role:1',
      _type: 'trend_micro_administrator_assigned_role',
      _class: 'ASSIGNED',
      _fromEntityKey: 'trend-micro-administrator:1',
      _toEntityKey: 'trend-micro-administrator-role:1',
    }),
    expect.objectContaining({
      _key:
        'trend-micro-administrator:8|assigned|trend-micro-administrator-role:2',
      _type: 'trend_micro_administrator_assigned_role',
      _class: 'ASSIGNED',
      _fromEntityKey: 'trend-micro-administrator:8',
      _toEntityKey: 'trend-micro-administrator-role:2',
    }),
  ]);
});
