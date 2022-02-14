import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA, getEmitterAddressEth, getEmitterAddressSolana, getSignedVAA, parseSequenceFromLogEth, parseSequenceFromLogSolana, postVaaSolana, redeemOnEth, redeemOnSolana, transferFromEth, transferFromSolana } from "@certusone/wormhole-sdk";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { ethers } from "ethers";
import { Signer } from "../contexts/EthereumProviderContext";
import { ETH_BRIDGE_ADDRESS, ETH_TOKEN_BRIDGE_ADDRESS, SOL_BRIDGE_ADDRESS, SOL_TOKEN_BRIDGE_ADDRESS, WORMHOLE_RPC_HOST } from "./constants";

export const transferFromSolanaToEth = async (
    wallet: WalletContextState,
    // eth signer
    signer: Signer,
    connection: Connection,
    payerAddress: string,
    fromAddress: string,
    mintAddress: string,
    amount: BigInt,
    targetAddress: Uint8Array,
    // targetChain: ChainId,
    originAddress?: Uint8Array,
    originChain?: ChainId,
    // fromOwnerAddress?: string,
) => {
    // Submit transaction - results in a Wormhole message being published
    const transaction = await transferFromSolana(
        connection,
        SOL_BRIDGE_ADDRESS,
        SOL_TOKEN_BRIDGE_ADDRESS,
        payerAddress,
        fromAddress,
        mintAddress,
        amount,
        targetAddress,
        CHAIN_ID_ETH,
        originAddress,
        originChain
    );
    if (!wallet.signTransaction) return;
    if (!signer) return;
    const signed = await wallet.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);
    // Get the sequence number and emitter address required to fetch the signedVAA of our message
    const info = await connection.getTransaction(txid);
    if (!info) return;
    const sequence = parseSequenceFromLogSolana(info);
    const emitterAddress = await getEmitterAddressSolana(SOL_TOKEN_BRIDGE_ADDRESS);
    // Fetch the signedVAA from the Wormhole Network (this may require retries while you wait for confirmation)
    const signedVaaResponse = await getSignedVAA(
        WORMHOLE_RPC_HOST,
        CHAIN_ID_SOLANA,
        emitterAddress,
        sequence
    );
    // Redeem on Ethereum
    await redeemOnEth(ETH_TOKEN_BRIDGE_ADDRESS, signer, signedVaaResponse.vaaBytes);
}

export const transferFromEthToSolana = async (
    signer: Signer, 
    tokenAddress: string, 
    amount: ethers.BigNumberish, 
    // recipientChain: ChainId, 
    recipientAddress: Uint8Array,
    connection: Connection,
    wallet: WalletContextState,
    payerAddress: string,
    // isSolanaNative: boolean,
    // mintAddress: string,
) => {
    if (!signer) return;
    // Submit transaction - results in a Wormhole message being published
    const receipt = await transferFromEth(
        ETH_TOKEN_BRIDGE_ADDRESS,
        signer,
        tokenAddress,
        amount,
        CHAIN_ID_SOLANA,
        recipientAddress
    );
    // Get the sequence number and emitter address required to fetch the signedVAA of our message
    const sequence = parseSequenceFromLogEth(receipt, ETH_BRIDGE_ADDRESS);
    const emitterAddress = getEmitterAddressEth(ETH_TOKEN_BRIDGE_ADDRESS);
    // Fetch the signedVAA from the Wormhole Network (this may require retries while you wait for confirmation)
    const signedVaaResponse = await getSignedVAA(
        WORMHOLE_RPC_HOST,
        CHAIN_ID_ETH,
        emitterAddress,
        sequence
    );
    if (!wallet.signTransaction) return;
    // On Solana, we have to post the signedVAA ourselves
    await postVaaSolana(
        connection,
        wallet.signTransaction,
        SOL_BRIDGE_ADDRESS,
        payerAddress,
        Buffer.from(signedVaaResponse.vaaBytes)
    );
    // Finally, redeem on Solana
    const transaction = await redeemOnSolana(
        connection,
        SOL_BRIDGE_ADDRESS,
        SOL_TOKEN_BRIDGE_ADDRESS,
        payerAddress,
        Buffer.from(signedVaaResponse.vaaBytes),
        // isSolanaNative,
        // mintAddress
    );
    const signed = await wallet.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);
}
