# Integration with JupiterOne

## Trend Micro + JupiterOne Integration Benefits

- Visualize Trend Micro administrators in the JupiterOne graph.
- Visualize Trend Micro endpoint agents and the devices they protect in the
  JupiterOne graph.
- Map Trend Micro endpoint agents to devices and devices to the employee who is
  the owner. 
- Monitor changes to Trend Micro administrators, endpoint agents, and devices
  using JupiterOne alerts. 

## How it Works

- JupiterOne periodically fetches Trend Micro administrators, agents, and 
devices to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph.
- Configure alerts to take action when the JupiterOne graph changes.

## Requirements

- JupiterOne requires an API Key that has been configured for read access.
- You must have permission in JupiterOne to install new integrations.

## Setup

JupiterOne provides a managed integration for Trend Micro Deep Security. The
integration connects directly to Trend Micro REST APIs to obtain configuration
metadata and analyze resource relationships.

## Data Model

### Entities

The following entity resources are ingested when the integration runs:

| Resources          | \_type of the Entity             | \_class of the Entity |
| ------------------ | -------------------------------- | --------------------- |
| Administrator      | `trend_micro_administrator`      | `User`                |
| Administrator Role | `trend_micro_administrator_role` | `AccessRole`          |
| API Key            | `trend_micro_api_key`            | `Key`                 |
| Computer           | `trend_micro_computer`           | `Host`                |
| Computer Group     | `trend_micro_computer_group`     | `Group`               |

### Relationships

The following relationships are created/mapped:

| From                         | Edge         | To                               |
| ---------------------------- | ------------ | -------------------------------- |
| `trend_micro_computer_group` | **HAS**      | `trend_micro_computer`           |
| `trend_micro_administrator`  | **ASSIGNED** | `trend_micro_administrator_role` |
