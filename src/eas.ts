import { RIGHT_TO_ENDORSE_SCHEMA } from "./config";

import {
  Attestation,
  EAS,
  SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";

import "dotenv/config";
import { Alchemy, Network, Wallet } from "alchemy-sdk";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.PRIVATE_KEY; // Clé privée Ethereum
const EAS_CONTRACT = process.env.EAS_CONTRACT;
const EAS_SCHEMA_REGISTRY = process.env.EAS_SCHEMA_REGISTRY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!EAS_CONTRACT) {
  console.error("EAS_CONTRACT value not found from .env file");
  process.exit();
}

if (!PRIVATE_KEY) {
  console.error("PRIVATE_KEY value not found from .env file");
  process.exit();
}

const alchemyProviderUrl = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`; // Replace with the appropriate Alchemy URL

const provider = new ethers.JsonRpcProvider(alchemyProviderUrl);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const eas = new EAS(EAS_CONTRACT);

eas.connect(signer);

export async function createAttestation(delegateAddress: string) {
  try {
    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("bool CanEndorse");
    const encodedData = schemaEncoder.encodeData([
      { name: "CanEndorse", value: true, type: "bool" },
    ]);

    const tx = await eas.attest({
      schema: RIGHT_TO_ENDORSE_SCHEMA,
      data: {
        recipient: delegateAddress,
        expirationTime: BigInt(0),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();

    console.log("New attestation UID:", newAttestationUID);
  } catch (error) {
    console.error("Erreur lors de la génération de l'attestation :", error);
  }
}

export async function revokeAttestation(attestationUid: string) {
  try {
    const txHash = await eas.revoke({
      schema: RIGHT_TO_ENDORSE_SCHEMA,
      data: {
        uid: attestationUid,
      },
    });

    let tx = await txHash.wait();
    console.log(`Attestation with UID ${attestationUid} revoked successfully.`);
  } catch (error) {
    console.error("Error during attestation revocation :", error);
  }
}
