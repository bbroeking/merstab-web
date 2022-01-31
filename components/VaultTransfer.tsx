import { useGateway, GatewayStatus } from '@civic/solana-gateway-react';
import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react'
import styles from '../styles/VaultTransfer.module.css';
import Image from 'next/image';
import { MerstabClient, Wallet } from '../protocol/merstab';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { civicEnv } from '../pages/_app';
import { AccountInfo, AccountLayout as TokenAccountLayout, u64 } from '@solana/spl-token';
import { BN } from '@project-serum/anchor';

const VaultTransfer = () => {
    const [amount, setAmount] = useState(0);
    const [depositActive, setDepositActive] = useState<boolean>(true);
    const [position, setPosition] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [merstabClient, setMerstabClient] = useState<MerstabClient>();
    // const { gatewayStatus, gatewayToken } = useGateway();
    const connection = useConnection();
    const wallet = useWallet();

    useEffect(() => {
        const setupClient = async () => {
            const provider = new anchor.Provider(connection.connection, wallet as Wallet, anchor.Provider.defaultOptions());
            const client = await MerstabClient.connect(provider, true);
            setMerstabClient(client);
        }
        setupClient();
    }, []);

    const fetchBalances = async () => {
        if (!merstabClient || !wallet.publicKey) return;
        const tokenAccount = await merstabClient.getTokenAccount(wallet.publicKey!);
        const stakedTokenAccount = await merstabClient.getStakedTokenAccount(wallet.publicKey!);
        const tokenAccountData = await connection.connection.getAccountInfo(tokenAccount);
        const stakedTokenAccountData = await connection.connection.getAccountInfo(stakedTokenAccount);
        const parsedTokenAccountData = TokenAccountLayout.decode(tokenAccountData?.data) as AccountInfo;
        const parsedStakedTokenAccountData = TokenAccountLayout.decode(stakedTokenAccountData?.data) as AccountInfo;

        setPosition(new BN(parsedStakedTokenAccountData.amount, undefined, "le").toNumber());
        setWalletBalance(new BN(parsedTokenAccountData.amount, undefined, "le").toNumber());
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
        if (!wallet || !wallet.publicKey || !merstabClient) return; // !gatewayToken?.publicKey 
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
