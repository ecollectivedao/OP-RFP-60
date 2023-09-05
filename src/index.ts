import { POOLING_INTERVAL, requiredVotingPower } from "./config";
import { createAttestation, revokeAttestation } from "./eas";
import { getAttestations, getSuspensions } from "./easIndexer";
import { Delegate, getDelegates } from "./optimismGovIndexer";

async function main() {
  const delegates = await getDelegates(requiredVotingPower);
  console.log(
    `${delegates.length} delegates have over ${
      requiredVotingPower / 100
    }% of the total voting supply`
  );

  const attestations = await getAttestations();
  console.log(`${attestations.length} non revoked attestation has been found`);

  const suspension = await getSuspensions();
  console.log(`${suspension.length} suspension has been found`);

  const activeSuspension = suspension.filter(
    (attestation) => attestation.expirationTime > new Date().getTime() / 1000
  );
  console.log(`${activeSuspension.length} active suspension has been found`);

  let attestationsToCreate = delegates.filter(
    (delegate) =>
      !attestations
        .map((attestation) => attestation.address)
        .includes(delegate.address) &&
      !activeSuspension
        .map((attestation) => attestation.address)
        .includes(delegate.address)
  );
  console.log(`=> ${attestationsToCreate.length} attestations to create`);

  let attestationsToRevoke = attestations.filter(
    (attestation) =>
      !delegates
        .map((delegate) => delegate.address)
        .includes(attestation.address) ||
      activeSuspension
        .map((attestation) => attestation.address)
        .includes(attestation.address)
  );
  console.log(`=> ${attestationsToRevoke.length} attestations to revoke`);

  for (const attestationToRevoke of attestationsToRevoke) {
    await revokeAttestation(attestationToRevoke.uid);
  }

  for (const attestionToCreate of attestationsToCreate) {
    await createAttestation(attestionToCreate.address);
  }

  console.log("--------------------------------------------------");

  setTimeout(() => {
    main();
  }, POOLING_INTERVAL);
}
main();
