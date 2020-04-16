import { retry } from '@lifeomic/attempt';
import nodeFetch, { Request } from 'node-fetch';

import { retryableRequestError, fatalRequestError } from './error';

const API_BASE_URL = 'https://app.deepsecurity.trendmicro.com/api';

// The Deep Security API accepts an 'api-secret-key' for authenticating requests.
//
// ref: https://automation.deepsecurity.trendmicro.com/article/dsaas/api-reference?platform=dsaas#section/Authentication
interface RequiredHeaders {
  'api-secret-key': string;
}

interface DeepSecurityClientInput {
  apiKey: string;
}

/**
 * Deep Security Api
 */
export class DeepSecurityClient {
  readonly requiredHeaders: RequiredHeaders;

  constructor({ apiKey }: DeepSecurityClientInput) {
    // add api to required headers which will be used
    // in all fetch requests from this client
    this.requiredHeaders = {
      'api-secret-key': apiKey,
    };
  }

  /**
   * A simple fetch wrapper for applying required request
   * headers/options and allowing for requests to be made relative to
   * the Deep Security API's base url.
   */
  fetch<T = object>(url: string, request?: Omit<Request, 'url'>): Promise<T> {
    return retry(
      async () => {
        const response = await nodeFetch(`${API_BASE_URL}${url}`, {
          ...request,
          headers: {
            ...this.requiredHeaders,
            ...request?.headers,
          },
        });

        /**
         * We are working with a json api, so just return the parsed data.
         */
        if (response.ok) {
          return response.json();
        }

        if (isRetryableRequest(response)) {
          throw retryableRequestError(response);
        } else {
          throw fatalRequestError(response);
        }
      },
      {
        maxAttempts: 10,
        delay: 200,
        jitter: true,
        handleError: (err, context) => {
          if (!err.retryable) {
            // can't retry this? just abort
            context.abort();
          }
        },
      },
    );
  }
}

/**
 * Function for determining if a request is retryable
 * based on the returned status.
 */
function isRetryableRequest({ status }: Response): boolean {
  return (
    // 5xx error from provider (their fault, might be retryable)
    // 429 === too many requests, we got rate limited so safe to try again
    status >= 500 || status === 429
  );
}
