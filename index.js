import CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import axios from "axios";

const mintNft = async (privateKey, assetName, description) => {
  const FEE = 300000;

  const publicKey = privateKey.to_public();

  const addr = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.testnet().network_id(),
    CardanoWasm.StakeCredential.from_keyhash(publicKey.hash()),
    CardanoWasm.StakeCredential.from_keyhash(publicKey.hash())
  ).to_address();

  console.log(`ADDR: ${addr.to_bech32()}`);

  const utxoRes = await axios.post(
    "https://testnet-backend.yoroiwallet.com/api/txs/utxoForAddresses",
    {
      addresses: [addr.to_bech32()],
    }
  );

  let utxo = null;

  for (const utxoEntry of utxoRes.data) {
    if (utxoEntry.amount > FEE) {
      utxo = utxoEntry;
    }
  }

  if (utxo === null) {
    throw new Error("no utxo found with sufficient ADA.");
  }

  console.log(`UTXO: ${JSON.stringify(utxo, null, 4)}`);

  const { data: slotData } = await axios.get(
    "https://testnet-backend.yoroiwallet.com/api/v2/bestblock"
  );

  const ttl = slotData.globalSlot + 60 * 60 * 2; // two hours from now

  const txBuilder = CardanoWasm.TransactionBuilder.new(
    CardanoWasm.TransactionBuilderConfigBuilder.new()
      .fee_algo(
        CardanoWasm.LinearFee.new(
          CardanoWasm.BigNum.from_str("44"),
          CardanoWasm.BigNum.from_str("155381")
        )
      )
      .coins_per_utxo_word(CardanoWasm.BigNum.from_str("34482"))
      .pool_deposit(CardanoWasm.BigNum.from_str("500000000"))
      .key_deposit(CardanoWasm.BigNum.from_str("2000000"))
      .max_value_size(5000)
      .max_tx_size(16384)
      .build()
  );

  const scripts = CardanoWasm.NativeScripts.new();

  const keyHash = CardanoWasm.BaseAddress.from_address(addr)
    .payment_cred()
    .to_keyhash();

  const keyHashScript = CardanoWasm.NativeScript.new_script_pubkey(
    CardanoWasm.ScriptPubkey.new(keyHash)
  );
  scripts.add(keyHashScript);

  const timelock = CardanoWasm.TimelockExpiry.new(ttl);
  const timelockScript = CardanoWasm.NativeScript.new_timelock_expiry(timelock);
  scripts.add(timelockScript);

  const mintScript = CardanoWasm.NativeScript.new_script_all(
    CardanoWasm.ScriptAll.new(scripts)
  );

  txBuilder.add_key_input(
    keyHash,
    CardanoWasm.TransactionInput.new(
      CardanoWasm.TransactionHash.from_bytes(Buffer.from(utxo.tx_hash, "hex")),
      utxo.tx_index
    ),
    CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(utxo.amount))
  );

  txBuilder.add_mint_asset_and_output_min_required_coin(
    mintScript,
    CardanoWasm.AssetName.new(Buffer.from(assetName)),
    CardanoWasm.Int.new_i32(1),
    CardanoWasm.TransactionOutputBuilder.new().with_address(addr).next()
  );

  const policyId = Buffer.from(mintScript.hash().to_bytes()).toString("hex");

  console.log(`POLICY_ID: ${policyId}`);

  const metadata = {
    [policyId]: {
      [assetName]: {
        name: assetName,
        description,
        image: "ipfs://QmZYPGQ6RSEmP2uHcL2pvHLNzwYrrUvjB6WT1zKGN2cujc",
        mediaType: "image/jpeg",
      },
    },
  };

  console.log(`METADATA: ${JSON.stringify(metadata, null, 4)}`);

  txBuilder.set_ttl(ttl);
  txBuilder.add_json_metadatum(
    CardanoWasm.BigNum.from_str("721"),
    JSON.stringify(metadata)
  );

  txBuilder.add_change_if_needed(addr);

  const txBody = txBuilder.build();
  const txHash = CardanoWasm.hash_transaction(txBody);

  console.log(`TX_HASH: ${Buffer.from(txHash.to_bytes()).toString("hex")}`);

  const witnesses = CardanoWasm.TransactionWitnessSet.new();
  const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new();
  vkeyWitnesses.add(CardanoWasm.make_vkey_witness(txHash, privateKey));
  witnesses.set_vkeys(vkeyWitnesses);
  const witnessScripts = CardanoWasm.NativeScripts.new();
  witnessScripts.add(mintScript);
  witnesses.set_native_scripts(witnessScripts);

  const unsignedTx = txBuilder.build_tx();

  const tx = CardanoWasm.Transaction.new(
    unsignedTx.body(),
    witnesses,
    unsignedTx.auxiliary_data()
  );

  const signedTx = Buffer.from(tx.to_bytes()).toString("base64");

  try {
    const { data } = await axios.post(
      "https://testnet-backend.yoroiwallet.com/api/txs/signed",
      {
        signedTx,
      }
    );

    console.log(`SUBMIT_RESULT: ${JSON.stringify(data, null, 4)}`);
  } catch (error) {
    console.error(
      `failed to submit tx via yoroi backend: ${error.toString()}. error details: ${JSON.stringify(
        error.response?.data
      )}`
    );
  }
};

const privateKey = CardanoWasm.PrivateKey.from_bech32(
  "ed25519_sk1fde2u8u2qme8uau5ac3w6c082gvtnmxt6uke2w8e07xwzewxee3q3n0f8e"
);

await mintNft(privateKey, "asdNFT", "some descr");
