export {};
// import {
//     attestFromEth,
//     attestFromSolana,
//     CHAIN_ID_ETH,
//     CHAIN_ID_SOLANA,
//     createWrappedOnEth,
//     createWrappedOnSolana,
//     getEmitterAddressEth,
//     getEmitterAddressSolana,
//     getSignedVAA,
//     parseSequenceFromLogEth,
//     parseSequenceFromLogSolana,
//     postVaaSolana
// } from '@certusone/wormhole-sdk'
// import { Connection } from '@solana/web3.js';
// import { Signer } from 'ethers';
// import { WalletContextState } from '@solana/wallet-adapter-react';

// const SOL_BRIDGE_ADDRESS = '3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5';
// const SOL_TOKEN_BRIDGE_ADDRESS = 'DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe' // devnet
// const WORMHOLE_RPC_HOST = 'https://wormhole-v2-testnet-api.certus.one';
// const ETH_TOKEN_BRIDGE_ADDRESS = '0xD8E4C2DbDd2e2bd8F1336EA691dBFF6952B1a6eB'; // goerli


// const ETH_BRIDGE_ADDRESS = '';

// export const attestSolanaEthereum = async (
//     connection: Connection,
//     payerAddress: string,
//     mintAddress: string,
//     solana: WalletContextState,
//     signer: Signer,
// ) => {
//     // Submit transaction - results in a Wormhole message being published
//     const transaction = await attestFromSolana(
//         connection,
//         SOL_BRIDGE_ADDRESS,
//         SOL_TOKEN_BRIDGE_ADDRESS,
//         payerAddress,
//         mintAddress
//     );

//     if (!solana.signTransaction)
//         return;

//     const signed = await solana.signTransaction(transaction);
//     const txid = await connection.sendRawTransaction(signed.serialize());
//     await connection.confirmTransaction(txid);
//     // Get the sequence number and emitter address required to fetch the signedVAA of our message
//     const info = await connection.getTransaction(txid);
//     if (!info)
//         return
//     const sequence = parseSequenceFromLogSolana(info);
//     const emitterAddress = await getEmitterAddressSolana(SOL_TOKEN_BRIDGE_ADDRESS);
//     // Fetch the signedVAA from the Wormhole Network (this may require retries while you wait for confirmation)
//     const signedVAA = await getSignedVAA(
//         WORMHOLE_RPC_HOST,
//         CHAIN_ID_SOLANA,
//         emitterAddress,
//         sequence
//     );

//     // Create the wrapped token on Ethereum
//     await createWrappedOnEth(ETH_TOKEN_BRIDGE_ADDRESS, signer, signedVAA.vaaBytes);
// }

// export const attestEthereumSolana = async (
//     connection: Connection,
//     signer: Signer,
//     tokenAddress: string,
//     solana: WalletContextState
// ) => {
//     // Submit transaction - results in a Wormhole message being published
//     const receipt = await attestFromEth(
//         ETH_TOKEN_BRIDGE_ADDRESS,
//         signer,
//         tokenAddress
//     );
//     // Get the sequence number and emitter address required to fetch the signedVAA of our message
//     const sequence = parseSequenceFromLogEth(receipt, ETH_BRIDGE_ADDRESS);
//     const emitterAddress = getEmitterAddressEth(ETH_TOKEN_BRIDGE_ADDRESS);
//     // Fetch the signedVAA from the Wormhole Network (this may require retries while you wait for confirmation)
//     const signedVAA  = await getSignedVAA(
//         WORMHOLE_RPC_HOST,
//         CHAIN_ID_ETH,
//         emitterAddress,
//         sequence
//     );

//     if(!solana.signTransaction)
//         return;

//     // On Solana, we have to post the signedVAA ourselves
//     await postVaaSolana(
//         connection,
//         solana.signTransaction!,
//         SOL_BRIDGE_ADDRESS,
//         solana.publicKey?.toString()!, // payer address
//         Buffer.from(signedVAA.vaaBytes)
//     );
//     // Finally, create the wrapped token
//     const transaction = await createWrappedOnSolana(
//         connection,
//         SOL_BRIDGE_ADDRESS,
//         SOL_TOKEN_BRIDGE_ADDRESS,
//         solana.publicKey?.toString()!,
//         signedVAA.vaaBytes
//     );
//     const signed = await solana.signTransaction(transaction);
//     const txid = await connection.sendRawTransaction(signed.serialize());
//     await connection.confirmTransaction(txid);
// }

