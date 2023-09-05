# OP-RFP60-Supervisor

This supervisor is pooling data from the Optimsm governance portal subgraph and the EAS subgraph in order to build a list of attestation to create or revoke a "Have the right to endorse proposals" attestation to a Delegate with enough voting power ( >= 0.25% of the total voting supply).

The required voting power is upgradable in the config.ts file

See more details in [The Optimism RFP #60](https://github.com/ethereum-optimism/ecosystem-contributions/issues/60)

## requirement

You need node in version 18

## Install

```sh
yarn
```

## launch the supervisor

```sh
yarn start
```
