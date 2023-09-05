import { Client, cacheExchange, fetchExchange } from "@urql/core";
import { requiredVotingPower } from "./config";

const client = new Client({
  url: "https://vote.optimism.io/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

const QUERY = `
query Query($first: Int!, $orderBy: DelegatesOrder!) {
    delegates(first: $first, orderBy: $orderBy) {
      edges {
        node {
          address {
            address
          }
          tokensRepresented {
            amount {
              amount
            }
            bpsOfDelegatedSupply
          }
        }
      }
    }
  }
`;

const VARIABLES = {
  first: 300,
  orderBy: "mostVotingPower",
};

export const getDelegates = async (requiredVotingPower: Number) => {
  return client
    .query(QUERY, VARIABLES)
    .toPromise()
    .then((result) => {
      // console.log(result.data.delegates.edges[0]);
      let delegates: Delegate[] = result.data.delegates.edges
        .map((delegate: any) => {
          requiredVotingPower;
          return {
            address: delegate.node.address.address,
            votingPower: delegate.node.tokensRepresented.bpsOfDelegatedSupply,
          };
        })
        .filter((delegate: any) => delegate.votingPower >= requiredVotingPower);

      return delegates;
    });
};

export type Delegate = {
  address: string;
  votingPower: Number;
};
