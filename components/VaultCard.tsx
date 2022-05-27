import React, { useCallback, useEffect, useState } from 'react';
import styles from '../styles/VaultCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Progress, Row } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { VAULT_CAPACITY } from './VaultDepositsInfo';
import { MerstabClient } from '../protocol/merstab';
import { PublicKey } from '@solana/web3.js';
import { useMerstab } from '../contexts/merstab';
import * as anchor from '@project-serum/anchor';

export interface VaultCardProps {
    client: MerstabClient | null;
    depositMint: PublicKey;
    mTokenMint: PublicKey;
    vaultName: string;
}

const VaultCard = (props: VaultCardProps) => {
    const wallet = useWallet();
    const [availableDepositToken, setAvailableDepositToken] = useState<number>(0);
    const [vaultDeposits, setVaultDeposits] = useState<number>(0);
    const [mTokenMint, setMToken] = useState<number>(0);

    const { client } = useMerstab();

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
        fetchBalances();
    }, [client]);

    return (
        <Link href='/vaults/DEVNETPERP'>
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
                        <span>{vaultDeposits} USDC</span>
                    </Row>
                    <Row>
                        <Progress
                            strokeColor='#D74B5E'
                            strokeLinecap='square'
                            trailColor='#474747'
                            percent={(vaultDeposits / VAULT_CAPACITY) * 100}
                            showInfo={false} />
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                        <span>Capacity</span>
                        <span>{VAULT_CAPACITY} USDC</span>
                    </Row>
                </Col>

                <Row className={styles.positionRow}>
                    <Col>Your position:</Col>
                    <Col>{mTokenMint} USDC</Col>
                </Row>
            </div>
        </Link>)
};

export default VaultCard;