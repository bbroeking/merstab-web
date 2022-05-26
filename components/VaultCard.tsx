import React, { useEffect, useState } from 'react';
import styles from '../styles/VaultCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Progress, Row } from 'antd';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { VAULT_CAPACITY } from './VaultDepositsInfo';
import { AccountInfo, AccountLayout as TokenAccountLayout } from '@solana/spl-token';
import { MerstabClient, Wallet } from '../protocol/merstab';
import { PublicKey } from '@solana/web3.js';

const VaultCard = () => {
    const connection = useConnection();
    const wallet = useWallet();
    const [merstabClient, setMerstabClient] = useState<MerstabClient>();
    const [vaultValue, setVaultValue] = useState<number>(0);
    const [position, setPosition] = useState(0);

    useEffect(() => {
        const setupClient = async () => {
            const provider = new anchor.AnchorProvider(connection.connection, wallet as Wallet, anchor.AnchorProvider.defaultOptions());
            const client = await MerstabClient.connect(provider, 'devnet'); // TODO: fix
            const VAULT_NAME = 'another' // TODO: fix
            const vaultValue = await client.getVaultValue(VAULT_NAME);
            setMerstabClient(client);
            setVaultValue(vaultValue);
        }
        setupClient();
    }, []);

    const fetchBalances = async () => {
        if (!merstabClient || !wallet || !wallet.publicKey) return;
        const vault = new PublicKey("5Fczud8oRx8f9yQhMcvW9EpehEpRyai5MBJieEgbTjfD"); // TODO: fix
        const stakedTokenAccount = await merstabClient.getMTokenAccount(vault, wallet.publicKey);
        const stakedTokenAccountData = await connection.connection.getAccountInfo(stakedTokenAccount);

        try {
            if (stakedTokenAccountData) {
                const parsedStakedTokenAccountData = TokenAccountLayout.decode(stakedTokenAccountData?.data) as AccountInfo;
                setPosition(new anchor.BN(parsedStakedTokenAccountData.amount, undefined, "le").toNumber());
            } else {
                setPosition(0);
            }
        } catch (err) {
            console.log('Error fetching balances: ', err);
            setPosition(0);
        }
    }

    useEffect(() => {
        fetchBalances();
    }, [merstabClient]);
    
    return (
        <Link href='/vault'>
            <div className={styles.vaultCard}>
                <Row className={styles.assetInfo}>
                    <div className={styles.spacer}></div>
                    <Image src="/svg/btcperp.svg" alt='bitcoin and usdc pair' width={80} height={80}></Image>
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                        <span style={{ fontSize: '24px', color: '#FFF' }}>BTC-PERP</span>
                        <span>Perpetual Futures Vault</span>
                    </div>
                </Row>

                <Row>
                    <div className={styles.vaultDescription}>Generates yield through deploying a market making strategy on Mango Markets</div>
                </Row>

                <Row>
                    <div className={styles.apyWrapper}>
                        <Row className={styles.apy}>22.1%</Row>
                        <Row>Projected APY</Row>
                    </div>
                </Row>

                <Col className={styles.vaultDepositsStatus}>
                    <Row style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                        <span>Deposits</span>
                        <span>{vaultValue} USDC</span>
                    </Row>
                    <Row>
                        <Progress
                            strokeColor='#D74B5E'
                            strokeLinecap='square'
                            trailColor='#474747'
                            percent={(vaultValue / VAULT_CAPACITY ) * 100}
                            showInfo={false} />
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                        <span>Capacity</span>
                        <span>{VAULT_CAPACITY} USDC</span>
                    </Row>
                </Col>

                <Row className={styles.positionRow}>
                    <Col>Your position:</Col>
                    <Col>{position} USDC</Col>
                </Row>
            </div>
        </Link>)
};


export default VaultCard;
