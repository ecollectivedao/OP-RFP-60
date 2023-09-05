# OP-RFP60-Supervisor

## Description 

This Supervisor is designed to streamline governance processes within the Optimism ecosystem.
It accomplishes this by pooling data from two sources: the Optimism governance portal subgraph and the EAS subgraph. 

The primary goal is to maintain a curated list of attestations for granting or revoking the "Have the right to endorse proposals" status to Delegates who possess significant voting power ( >= 0.25% of the total voting supply).

It's also possible to configure the voting power through the config.ts file to adapt to changing governance needs.


See more details in [The Optimism RFP #60](https://github.com/ethereum-optimism/ecosystem-contributions/issues/60)

## Table of Contents
- [Requirement](#requirement)
- [Installation](#Installation)
- [Launch the Supervisor](#launchthesupervisor)

## Requirement

You need node in version 18

## Installation

```sh
yarn
```

## Launch the Supervisor

```sh
yarn start
```

Once you lauch the Supervisor, the number of delegates, non revoked attestations, suspensions and attestation to create/revoke will be display like :

```shell
61 delegates have over 0.25% of the total voting supply
61 non revoked attestation has been found
9 suspension has been found
0 active suspension has been found
=> 0 attestations to create
=> 0 attestations to revoke
```

