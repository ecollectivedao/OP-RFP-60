import { Client, cacheExchange, fetchExchange } from "@urql/core";
import { RIGHT_TO_ENDORSE_SCHEMA, IS_SUSPENDED_SCHEMA } from "./config";

const client = new Client({
  url: "https://optimism-goerli-bedrock.easscan.org/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

const QUERY = `
query Attestations($where: AttestationWhereInput) {
  attestations(where: $where) {
    id
    recipient
  }
}
`;

const SUSPENSION_QUERY = `
query Attestations($where: AttestationWhereInput) {
  attestations(where: $where) {
    recipient
    expirationTime
  }
}
`;

const SUSPENSION_VARIABLES = {
  where: {
    schemaId: {
      equals: IS_SUSPENDED_SCHEMA,
    },
    revoked: {
      equals: false,
    },
  },
};

const VARIABLES = {
  where: {
    schemaId: {
      equals: RIGHT_TO_ENDORSE_SCHEMA,
    },
    revoked: {
      equals: false,
    },
  },
};

export async function getAttestations() {
  return client
    .query(QUERY, VARIABLES)
    .toPromise()
    .then((result) => {
      let canEndorseAttestations: CanEndorseAttestation[] =
        result.data.attestations.map((a: any) => {
          return {
            address: a.recipient,
            uid: a.id,
          };
        });
      return canEndorseAttestations;
    });
}

export type CanEndorseAttestation = {
  address: string;
  uid: string;
};

export async function getSuspensions() {
  return client
    .query(SUSPENSION_QUERY, SUSPENSION_VARIABLES)
    .toPromise()
    .then((result) => {
      let suspensionAttestation: SuspensionAttestation[] =
        result.data.attestations.map((a: any) => {
          return {
            address: a.recipient,
            expirationTime: a.expirationTime,
          };
        });
      return suspensionAttestation;
    });
}

export type SuspensionAttestation = {
  address: string;
  expirationTime: number
};
