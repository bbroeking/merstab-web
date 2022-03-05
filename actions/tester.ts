import {
    ChainId,
    CHAIN_ID_SOLANA,
    CHAIN_ID_TERRA,
    getEmitterAddressEth,
    getEmitterAddressSolana,
    getEmitterAddressTerra,
    getSignedVAAWithRetry,
    hexToUint8Array,
    isEVMChain,
    parseSequenceFromLogEth,
    parseSequenceFromLogSolana,
    parseSequenceFromLogTerra,
    postVaaSolanaWithRetry,
    redeemAndUnwrapOnSolana,
    redeemOnSolana,
    transferFromEth,
    transferFromEthNative,
    transferFromSolana,
    transferFromTerra,
    transferNativeSol,
    uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Transaction } from "@solana/web3.js";

import { Signer } from "ethers";
import { parseUnits, zeroPad } from "ethers/lib/utils";
import { ETH_BRIDGE_ADDRESS, ETH_TOKEN_BRIDGE_ADDRESS, MAX_VAA_UPLOAD_RETRIES_SOLANA, SOL_BRIDGE_ADDRESS, SOL_TOKEN_BRIDGE_ADDRESS, WORMHOLE_RPC_HOST } from "./constants";

export async function evm(
    signer: Signer,
    tokenAddress: string,
    decimals: number,
    amount: string,
    recipientChain: ChainId,
    recipientAddress: Uint8Array,
    isNative: boolean,
    chainId: ChainId
) {
    try {
        const amountParsed = parseUnits(amount, decimals);
        console.log(`amount parsed ${amountParsed}`);
        const receipt = isNative
            ? await transferFromEthNative(
                "do not use",
                signer,
                amountParsed,
                recipientChain,
                recipientAddress
            )
            : await transferFromEth(
                ETH_TOKEN_BRIDGE_ADDRESS,
                signer,
                tokenAddress,
                amountParsed,
                recipientChain,
                recipientAddress
            );
        console.log(`receipt  ${receipt}`);
        const sequence = parseSequenceFromLogEth(
            receipt,
            ETH_BRIDGE_ADDRESS
        );
        console.log(`sequence: ${sequence}`);
        const emitterAddress = getEmitterAddressEth(
            ETH_TOKEN_BRIDGE_ADDRESS
        );
        console.log(`emitter ${emitterAddress}`);
        const { vaaBytes } = await getSignedVAAWithRetry(
            [WORMHOLE_RPC_HOST],
            chainId,
            emitterAddress,
            sequence.toString()
        );
        console.log(`vaaBytes ${vaaBytes}`);
        return vaaBytes;
    } catch (e) {
        console.error(e);
    }
}

export async function solana(
    connection: Connection,
    wallet: WalletContextState,
    payerAddress: string, //TODO: we may not need this since we have wallet
    signedVAA: Uint8Array,
    isNative: boolean
) {
    try {
        if (!wallet.signTransaction) {
            throw new Error("wallet.signTransaction is undefined");
        }
        await postVaaSolanaWithRetry(
            connection,
            wallet.signTransaction,
            SOL_BRIDGE_ADDRESS,
            payerAddress,
            Buffer.from(signedVAA),
            MAX_VAA_UPLOAD_RETRIES_SOLANA
        );
        // TODO: how do we retry in between these steps
        const transaction = isNative
            ? await redeemAndUnwrapOnSolana(
                connection,
                SOL_BRIDGE_ADDRESS,
                SOL_TOKEN_BRIDGE_ADDRESS,
                payerAddress,
                signedVAA
            )
            : await redeemOnSolana(
                connection,
                SOL_BRIDGE_ADDRESS,
                SOL_TOKEN_BRIDGE_ADDRESS,
                payerAddress,
                signedVAA
            );
        const txid = await signSendAndConfirm(wallet, connection, transaction);
        console.log(txid);
        // TODO: didn't want to make an info call we didn't need, can we get the block without it by modifying the above call?
    } catch (e) {
        console.log(e);
    }
}

export async function signSendAndConfirm(
    wallet: WalletContextState,
    connection: Connection,
    transaction: Transaction
) {
    if (!wallet.signTransaction) {
        throw new Error("wallet.signTransaction is undefined");
    }
    const signed = await wallet.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);
    return txid;
}