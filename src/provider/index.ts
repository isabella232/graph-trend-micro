import { IntegrationInstance } from '@jupiterone/integration-sdk-core';
import { DeepSecurityClient } from './DeepSecurityClient';
import { TrendMicroIntegrationConfig } from '../types';

export * from './types';

/**
 * Creates a DeepSecurityClient from an integration instance using it's
 * api key.
 */
export function createDeepSecurityClient(
  instance: IntegrationInstance<TrendMicroIntegrationConfig>,
): DeepSecurityClient {
  const apiKey = instance.config?.apiKey;

  if (!apiKey) {
    throw new Error(
      'Configuration option "apiKey" is missing on the integration instance config',
    );
  }

  return new DeepSecurityClient({ apiKey });
}
