import CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import axios from "axios";
import cbor from "cbor";




const pvtKey = CardanoWasm.PrivateKey.generate_ed25519().to_bech32();

console.log(pvtKey);

const privateKey = CardanoWasm.PrivateKey.from_bech32(pvtKey);

console.log(privateKey);

const publicKey = privateKey.to_public();

  const addr = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.testnet().network_id(),
    CardanoWasm.StakeCredential.from_keyhash(publicKey.hash()),
    CardanoWasm.StakeCredential.from_keyhash(publicKey.hash())
  ).to_address();

console.log(`ADDR: ${addr.to_bech32()}`);