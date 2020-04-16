import { DeepSecurityClient } from '../DeepSecurityClient';

import nodeFetch from 'node-fetch';
import fetchMock from 'jest-fetch-mock';
import waitForExpect from 'wait-for-expect';

beforeEach(() => {
  fetchMock.doMock();
});

afterEach(() => {
  jest.useRealTimers();
});

test('appends passed in path to api base url', async () => {
  const fetchSpy = jest.spyOn(nodeFetch, 'default');

  fetchMock.mockResponse(JSON.stringify({}));

  const apiKey = 'my fake api key';
  const client = new DeepSecurityClient({ apiKey });

  await client.fetch('/administrators', {
    method: 'GET',
  });

  expect(fetchSpy).toHaveBeenCalledTimes(1);
  expect(fetchSpy).toHaveBeenCalledWith(
    'https://app.deepsecurity.trendmicro.com/api/administrators',
    expect.any(Object),
  );
});

test('applies api key to requests made with client', async () => {
  const fetchSpy = jest.spyOn(nodeFetch, 'default');

  fetchMock.mockResponse(JSON.stringify({}));

  const apiKey = 'my fake api key';
  const client = new DeepSecurityClient({ apiKey });

  await client.fetch('/administrators');

  expect(fetchSpy).toHaveBeenCalledTimes(1);
  expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
    headers: {
      'api-secret-key': apiKey,
    },
  });
});

test('merges required headers with additional headers via options', async () => {
  const fetchSpy = jest.spyOn(nodeFetch, 'default');

  fetchMock.mockResponse(JSON.stringify({}));

  const apiKey = 'my fake api key';
  const client = new DeepSecurityClient({ apiKey });

  await client.fetch('/administrators', {
    headers: {
      newHeader: '1',
    },
  });

  expect(fetchSpy).toHaveBeenCalledTimes(1);
  expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
    headers: {
      'api-secret-key': apiKey,
      newHeader: '1',
    },
  });
});

test('returns response body on successful requests', async () => {
  fetchMock.mockResponse(
    JSON.stringify({
      data: true,
    }),
  );

  const apiKey = 'my fake api key';
  const client = new DeepSecurityClient({ apiKey });

  const result = await client.fetch('/administrators', {
    headers: {
      newHeader: '1',
    },
  });

  expect(result).toEqual({
    data: true,
  });
});

describe('retry logic', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  [{ status: 500 }, { status: 504 }, { status: 429 }].forEach(({ status }) => {
    test(`retries ${status} errors up to 10 times before rejecting`, async () => {
      const fetchSpy = jest.spyOn(nodeFetch, 'default');

      fetchMock.mockResponse(() =>
        Promise.resolve({
          status: 500,
        }),
      );

      const apiKey = 'my fake api key';
      const client = new DeepSecurityClient({ apiKey });

      let fetchRejected = false;
      client.fetch('/administrators').catch(() => {
        fetchRejected = true;
      });

      await waitForExpect(() => {
        jest.runAllTimers();
        expect(fetchRejected).toEqual(true);
      });

      expect(fetchSpy).toHaveBeenCalledTimes(10);
    });
  });

  test('resolves if result returns after a retry', async () => {
    const fetchSpy = jest.spyOn(nodeFetch, 'default');

    fetchMock
      .mockResponseOnce(() =>
        Promise.resolve({
          status: 429,
        }),
      )
      .mockResponseOnce(() =>
        Promise.resolve({
          status: 429,
        }),
      )
      .mockResponseOnce(() =>
        Promise.resolve({
          status: 200,
          body: JSON.stringify({ success: true }),
        }),
      );

    const apiKey = 'my fake api key';
    const client = new DeepSecurityClient({ apiKey });

    let fetchComplete = false;
    const fetchPromise = client.fetch('/administrators').then((result) => {
      fetchComplete = true;
      return result;
    });

    await waitForExpect(() => {
      jest.runAllTimers();
      expect(fetchComplete).toEqual(true);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(await fetchPromise).toEqual({ success: true });
  });
});
