import { approveEth, CHAIN_ID_ETH, getForeignAssetSolana, hexToUint8Array, nativeToHexString } from '@certusone/wormhole-sdk';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Button } from 'antd';
import { parseUnits } from 'ethers/lib/utils';
import React, { useEffect } from 'react'
import { ETH_TOKEN_BRIDGE_ADDRESS, SOL_TOKEN_BRIDGE_ADDRESS } from '../actions/constants';
import { transferFromEthToSolana, transferFromSolanaToEth } from '../actions/transfer';
import { attestFromEthereumToSolana } from '../actions/wormhole';
import { useEthereumProvider } from '../contexts/EthereumProviderContext'

const WormHole = () => {
    const eth = useEthereumProvider();
    const wallet = useWallet();
    const connection = useConnection();

    useEffect(() => {
        eth.connect();
    }, []);

    const onEthSol = async () => {
        const tokenAddress = '0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc';
        if (!eth.signer || !wallet.publicKey || !wallet.signTransaction) return;

        // attest
        // await attestFromEthereumToSolana(
        //     connection.connection,
        //     eth.signer,
        //     tokenAddress,
        //     wallet
        // );

        const solanaMintKey = new PublicKey(
            (await getForeignAssetSolana(
                connection.connection,
                SOL_TOKEN_BRIDGE_ADDRESS,
                CHAIN_ID_ETH,
                hexToUint8Array(nativeToHexString(tokenAddress, CHAIN_ID_ETH) || "")
            )) || ""
        );
        console.log(`Solana Mint Key: ${solanaMintKey}`);

        const recipient = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            solanaMintKey,
            wallet.publicKey
        );

        console.log(`Recipient: ${recipient}`)
        // create the associated token account if it doesn't exist
        const associatedAddressInfo = await connection.connection.getAccountInfo(
            recipient
        );
        if (!associatedAddressInfo) {
            const transaction = new Transaction().add(
                await Token.createAssociatedTokenAccountInstruction(
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                    TOKEN_PROGRAM_ID,
                    solanaMintKey,
                    recipient,
                    wallet.publicKey, // owner
                    wallet.publicKey // payer
                )
            );
            const { blockhash } = await connection.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet.publicKey;
            // sign, send, and confirm transaction
            const signedTransaction = await wallet.signTransaction(transaction);
            const txid = await connection.connection.sendRawTransaction(
                signedTransaction.serialize()
            );
            await connection.connection.confirmTransaction(txid);
        }
        // create a signer for Eth
        const amount = parseUnits("1", 18);
        // approve the bridge to spend tokens
        await approveEth(
            ETH_TOKEN_BRIDGE_ADDRESS,
            tokenAddress,
            eth.signer,
            amount
        );
        // transfer
        await transferFromEthToSolana(
            eth.signer,
            tokenAddress,
            amount,
            Buffer.from(wallet.publicKey.toString()),
            connection.connection,
            wallet,
            wallet.publicKey.toString()
        );
    }

    const onSolEth = async () => {
        transferFromSolanaToEth(
            wallet,
            eth.signer,
            connection.connection,
            'payerAddress',
            'fromAddress',
            'mintAddress',
            BigInt(1),
            Buffer.from('targetAddress')
        );
    }

    return (
        <div>
            <Button onClick={onSolEth}>Solana -{'>'} ETH</Button>
            <Button onClick={onEthSol}>ETH -{'>'} Solana</Button>
        </div>
    )
}

export default WormHole;