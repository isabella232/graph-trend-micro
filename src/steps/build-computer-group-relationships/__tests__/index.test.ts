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
      _key: 'trend-micro-computer:34|has|trend-micro-computer-group:79',
      _type: 'trend_micro_computer_has_group',
      _class: 'HAS',
      _fromEntityKey: 'trend-micro-computer:34',
      _toEntityKey: 'trend-micro-computer-group:79',
      displayName: 'HAS',
    }),
    expect.objectContaining({
      _key: 'trend-micro-computer:35|has|trend-micro-computer-group:79',
      _type: 'trend_micro_computer_has_group',
      _class: 'HAS',
      _fromEntityKey: 'trend-micro-computer:35',
      _toEntityKey: 'trend-micro-computer-group:79',
      displayName: 'HAS',
    }),
  ]);
});
