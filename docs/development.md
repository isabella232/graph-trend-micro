# Development

This integration at the moment mainly focuses on the
[Deep Security](https://www.trendmicro.com/en_us/business/products/hybrid-cloud/deep-security.html)
suite of features from Trend Micro for collecting data
vulnerabilities in workloads.

This integration uses the
[Deep Security API](https://automation.deepsecurity.trendmicro.com/article/dsaas/api-reference?platform=dsaas)
for collecting data.

## Prerequisites

Aside from what is documented in the [README](../README.md),
no special tooling is required to run and test this integration.

## Provider account setup

### Deep Security

To setup a Trend Micro Deep Security account for development,
please take the following steps:

1. Visit the [Deep Security](https://www.trendmicro.com/en_us/business/products/hybrid-cloud/deep-security.html) site.
1. Click `Try it for free` (shown in the image below).
1. Fill out the Trial sign up form then click `Sign up`.
1. After you have successfuly signed up, you should receive an email
to confirm your 30 day trial. Click on the link and you should be able
to sign into the Deep Security dashboard.

## Authentication

Once you've created your account, you'll need to generate an API Key
to access the Deep Security API.

1. First, visit https://help.deepsecurity.trendmicro.com/api-key.html
and follow the instructions to create an API Key.
Make sure you select the `Auditor` role for read-only access of
resources exposed by the Deep Security API.
1. Copy the API Key, create a `.env` file at the root of this project,
and set an `API_KEY` variable with the copied value.
```bash
API_KEY="paste the api key here"
```

All requests to the Deep Security API require a
`api-secret-key` header to be set with an API key when making requests
([reference authentication doc](https://automation.deepsecurity.trendmicro.com/article/dsaas/api-reference?platform=dsaas)).

After following the above steps, you should be able to now invoke the
integration to start collecting data. The integration
will pull in the `API_KEY` variable from the `.env` file and add the
`api-secret-key` header with the `API_KEY` value when making requests.
