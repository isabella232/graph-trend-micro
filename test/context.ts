import { createMockStepExecutionContext } from '@jupiterone/integration-sdk/testing';

/**
 * Only used when a .env file is not setup or when tests
 * are running in CI.
 */
const TEST_CONFIG = {
  apiKey: 'test',
} as const;

export function createStepContext(): ReturnType<
  typeof createMockStepExecutionContext
> {
  const context = createMockStepExecutionContext();
  if (!context.instance.config) {
    context.instance.config = TEST_CONFIG;
  }
  return context;
}
