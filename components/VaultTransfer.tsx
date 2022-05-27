import { Button, Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import styles from '../styles/VaultTransfer.module.css';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { toast } from 'react-toastify';
import WormholeDeposit from './WormholeDeposit';
import { PublicKey } from '@solana/web3.js';
import { useMerstab } from '../contexts/merstab';

export interface VaultTransferProps {
    depositMint: PublicKey;
    mTokenMint: PublicKey;
    vaultName: string;
}

const VaultTransfer = (props: VaultTransferProps) => {
    const [amount, setAmount] = useState(0);
    const [depositActive, setDepositActive] = useState<boolean>(true);
    const wallet = useWallet();

    const { client } = useMerstab();
    const [availableDepositToken, setAvailableDepositToken] = useState<number>(0);
    const [vaultDeposits, setVaultDeposits] = useState<number>(0);
    const [mTokenMint, setMToken] = useState<number>(0);

    const fetchBalances = useCallback(async () => {
        if (!client || !wallet || !wallet.publicKey) {
            console.log(`One of the following are undefined: ${client}, ${wallet}`);
            return
        };

        try {
            const depositTokenAccount = await client.getTokenAccount(props.depositMint, wallet.publicKey);
            if (depositTokenAccount) {
                const balance = await client.getTokenAccountBalance(depositTokenAccount.address);
                if (balance?.value?.uiAmount) {
                    console.log(balance?.value?.uiAmount)
                    setAvailableDepositToken(balance?.value?.uiAmount);
                } else {
                    setAvailableDepositToken(0);
                }
            } else {
                setAvailableDepositToken(0);
            }


            const vaultDepositTokenAccount = await client.getVaultDepositAccount(props.vaultName);
            if (vaultDepositTokenAccount) {
                const balance = await client.getTokenAccountBalance(vaultDepositTokenAccount.address);
                if (balance?.value?.uiAmount) {
                    console.log(balance?.value?.uiAmount)
                    setVaultDeposits(balance?.value?.uiAmount);
                } else {
                    setVaultDeposits(0);
                }
            } else {
                setVaultDeposits(0);
            }

            const merstabDepositTokenAccount = await client.getMTokenAccount(props.mTokenMint, wallet.publicKey);
            console.log(`vault deposits: ${merstabDepositTokenAccount.address}`);

            if (merstabDepositTokenAccount) {
                const balance = await client.getTokenAccountBalance(merstabDepositTokenAccount.address);
                if (balance?.value?.uiAmount) {
                    setMToken(balance?.value?.uiAmount);
                } else {
                    setMToken(0);
                }
            } else {
                setMToken(0);
            }

        } catch (err) {
            console.log('Error fetching balances: ', err);
            setAvailableDepositToken(0);
            setVaultDeposits(0);
            setMToken(0);
        }
    }, [client, props.depositMint, props.mTokenMint]);
    
    useEffect(() => {
        fetchBalances()
    }, [client, wallet])

    const onInputChange = (event: any) => {
        const amount = parseFloat(event.target.value);
        if (amount)
            setAmount(amount);
    }
    const onTabToggle = (toggle: boolean) => {
        setDepositActive(toggle);
        setAmount(0);
    }

    const onInteract = async () => {
        if (!wallet || !wallet.publicKey || !client) {
            console.log('Error establishing connection');
            console.log({ wallet, client });
            console.log('Attempting to establish connection to wallet');
            await wallet.connect();

            if (!wallet || !wallet.publicKey || !client) return;
        };
        if (depositActive) {
            await client.stake(new anchor.BN(amount), wallet.publicKey);
            toast.success('Deposit Successful', {
                theme: "dark"
            });
        }
        else {
            await client.unstake(new anchor.BN(amount), wallet.publicKey);
            toast.success('Withdrawal Successful', {
                theme: "dark"
            });
        }
        fetchBalances();
    }

    const setMax = () => {
        const max = depositActive ? availableDepositToken : mTokenMint;
        setAmount(max);
    }

    return (
        <div className={styles.transferSection}>
            <div className={styles.innerTransfer}>
                <Row className={styles.buttonRow}>
                    <Button
                        onClick={() => onTabToggle(true)}
                        className={`${styles.transactionButton} ${depositActive ? styles.active : ""}`}>Deposit</Button>
                    <Button
                        onClick={() => onTabToggle(false)}
                        className={`${styles.transactionButton} ${!depositActive ? styles.active : ""}`}>Withdraw</Button>
                </Row>
                <Row>
                    <div className={styles.valueInputRow}>
                        <Button onClick={setMax} className={styles.maxButton}>MAX</Button>
                        <input type='number' className={styles.amountField} value={amount} onChange={onInputChange}></input>
                        <Image className={styles.currencyIcon} src='/svg/usdc.svg' width={30} height={30}></Image>
                        <div className={styles.spacer}></div>
                    </div>
                </Row>
                <Row className={`${styles.availableDepositTokenRow} ${styles.availableDepositToken}`}>
                    <Row>Wallet balance: </Row>
                    <Row><span>{depositActive ? availableDepositToken : mTokenMint} USDC</span></Row>
                </Row>
                <Row className={styles.displayRow}>
                    <Button
                        onClick={onInteract}
                        className={styles.actionButton}
                        disabled={!wallet.connected}>
                        {depositActive ? "DEPOSIT" : "WITHDRAW"}
                    </Button>
                </Row>
                {/* <Row className={styles.displayRow}>
                    <WormholeDeposit depositAmount={amount}></WormholeDeposit>
                </Row> */}
                <Row className={styles.bottomRow}>
                    <span className={styles.fundsProcessingRow}>Funds are deposited onto Mango Markets at 12:00AM UTC.</span>
                </Row>
            </div>
        </div>
    )
}

export default VaultTransfer
