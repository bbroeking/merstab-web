import { 
    ChainId, 
    CHAIN_ID_ETH, 
    CHAIN_ID_SOLANA, 
    getEmitterAddressEth, 
    getEmitterAddressSolana, 
    getIsTransferCompletedSolana, 
    getSignedVAA, 
    getSignedVAAWithRetry, 
    hexToUint8Array, 
    nativeToHexString, 
    parseSequenceFromLogEth, 
    parseSequenceFromLogSolana, 
    postVaaSolana, 
    redeemAndUnwrapOnSolana, 
    redeemOnEth, 
    redeemOnSolana, 
    transferFromEth, 
    transferFromEthNative, 
    transferFromSolana 
} from "@certusone/wormhole-sdk";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
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
    recipientAddress: PublicKey,
    connection: Connection,
    wallet: WalletContextState,
    payerAddress: string,
    // isSolanaNative: boolean,
    // mintAddress: string,
) => {
    if (!signer) return;
    // Submit transaction - results in a Wormhole message being published
    const hexString = nativeToHexString(recipientAddress.toString(), CHAIN_ID_SOLANA);
    if(!hexString) {
        throw new Error("Invalid recipient");
    }
    const receipt = await transferFromEth(
        ETH_TOKEN_BRIDGE_ADDRESS,
        signer,
        tokenAddress,
        amount,
        CHAIN_ID_SOLANA,
        hexToUint8Array(hexString)
    );
    console.log(`recepit: ${JSON.stringify(receipt)}`);
    // Get the sequence number and emitter address required to fetch the signedVAA of our message
    const sequence = parseSequenceFromLogEth(receipt, ETH_BRIDGE_ADDRESS);
    console.log(`sequence ${sequence}`)
    const emitterAddress = getEmitterAddressEth(ETH_TOKEN_BRIDGE_ADDRESS);
    console.log(`sequence ${emitterAddress}`)

    // Fetch the signedVAA from the Wormhole Network (this may require retries while you wait for confirmation)
    const { vaaBytes: signedVaa } = await getSignedVAAWithRetry(
        [WORMHOLE_RPC_HOST],
        CHAIN_ID_ETH,
        emitterAddress,
        sequence
    );
    console.log(`sequence ${signedVaa}`)

    if (!wallet.signTransaction) return;
    // On Solana, we have to post the signedVAA ourselves
    await postVaaSolana(
        connection,
        wallet.signTransaction,
        SOL_BRIDGE_ADDRESS,
        payerAddress,
        Buffer.from(signedVaa)
    );

    await getIsTransferCompletedSolana(
        SOL_TOKEN_BRIDGE_ADDRESS,
        signedVaa,
        connection
    )
    // Finally, redeem on Solana
    const transaction = await redeemOnSolana(
        connection,
        SOL_BRIDGE_ADDRESS,
        SOL_TOKEN_BRIDGE_ADDRESS,
        payerAddress,
        signedVaa,
    );
    const signed = await wallet.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: true});
    console.log(`transaction id: ${txid}`);
    await connection.confirmTransaction(txid);
}
