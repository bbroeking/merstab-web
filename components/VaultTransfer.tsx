import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react'
import styles from '../styles/VaultTransfer.module.css';
import Image from 'next/image';
import { MerstabClient, Wallet } from '../protocol/merstab';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { AccountInfo, AccountLayout as TokenAccountLayout, u64 } from '@solana/spl-token';
import { BN } from '@project-serum/anchor';

const VaultTransfer = () => {
    const [amount, setAmount] = useState(0);
    const [depositActive, setDepositActive] = useState<boolean>(true);
    const [position, setPosition] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [merstabClient, setMerstabClient] = useState<MerstabClient>();
    const anchorWallet = useAnchorWallet();
    // const { gatewayStatus, gatewayToken } = useGateway();
    const connection = useConnection();
    const wallet = useWallet();

    const setupClient = async () => {
        const provider = new anchor.Provider(connection.connection, anchorWallet as Wallet, anchor.Provider.defaultOptions());
        const client = await MerstabClient.connect(provider, true);
        setMerstabClient(client);
    }

    useEffect(() => {
        if (!anchorWallet) {
            console.log("anchor wallet undefined")
        }
        setupClient();
    }, []);

    const fetchBalances = async () => {
        if (!merstabClient || !wallet || !wallet.publicKey) return;
        const tokenAccount = await merstabClient.getTokenAccount(wallet.publicKey);
        const stakedTokenAccount = await merstabClient.getStakedTokenAccount(wallet.publicKey);
        const tokenAccountData = await connection.connection.getAccountInfo(tokenAccount);
        const stakedTokenAccountData = await connection.connection.getAccountInfo(stakedTokenAccount);

        try {
            if (tokenAccountData) {
                const parsedTokenAccountData = TokenAccountLayout.decode(tokenAccountData?.data) as AccountInfo;
                setWalletBalance(new BN(parsedTokenAccountData.amount, undefined, "le").toNumber());
            } else {
                setWalletBalance(0);
            }
            if (stakedTokenAccountData) {
                const parsedStakedTokenAccountData = TokenAccountLayout.decode(stakedTokenAccountData?.data) as AccountInfo;
                setPosition(new BN(parsedStakedTokenAccountData.amount, undefined, "le").toNumber());
            } else {
                setPosition(0);
            }

        } catch (err) {
            console.log('Error fetching balances: ', err);
            setPosition(0);
            setWalletBalance(0);
        }
    }

    useEffect(() => {
        fetchBalances()
    }, [merstabClient, wallet])

    const onInputChange = (event: any) => {
        const amount = parseFloat(event.target.value);
        if (amount)
            setAmount(amount);
    }
    const onTabToggle = (toggle: boolean) => {
        setDepositActive(toggle);
    }

    const onInteract = async () => {
        if (!wallet || !wallet.publicKey || !merstabClient) {
            console.log('Error establishing connection');
            console.log({ wallet, merstabClient });
            console.log('Attempting to establish connection to wallet');
            await wallet.connect();
            await setupClient();

            if(!wallet || !wallet.publicKey || !merstabClient) return;
        };
        if (depositActive)
            await merstabClient.stake(new anchor.BN(amount, undefined, "le"), wallet.publicKey); //gatewayToken?.publicKey, civicEnv.test.gatekeeperNetwork
        else
            await merstabClient.unstake(new anchor.BN(amount, undefined, "le"), wallet.publicKey);
        fetchBalances();
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
                <Row className={styles.positionRow}>
                    <Col>Your position:</Col>
                    <Col>{position} USDC</Col>
                </Row>
                <Row>
                    <div className={styles.valueInputRow}>
                        <Button className={styles.maxButton}>MAX</Button>
                        <input type='number' className={styles.amountField} value={amount} onChange={onInputChange}></input>
                        <Image className={styles.currencyIcon} src='/svg/usdc.svg' width={30} height={30}></Image>
                        <div className={styles.spacer}></div>
                    </div>
                </Row>
                <Row className={`${styles.walletBalanceRow} ${styles.walletBalance}`}>
                    <Row>Wallet balance: </Row>
                    <Row><span>{walletBalance} USDC</span></Row>
                </Row>
                <Row className={styles.displayRow}>
                    <Button
                        onClick={onInteract}
                        className={styles.actionButton}
                        disabled={!wallet.connected}>
                        {depositActive ? "DEPOSIT" : "WITHDRAW"}
                    </Button>
                </Row>
                <Row className={styles.bottomRow}>
                    <span className={styles.fundsProcessingRow}>Funds are deposited onto Mango Markets at 12:00AM UTC.</span>
                </Row>
            </div>
        </div>
    )
}

export default VaultTransfer
