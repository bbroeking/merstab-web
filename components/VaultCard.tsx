import React, { useCallback, useEffect, useState } from 'react';
import styles from '../styles/VaultCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Progress, Row } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { MerstabClient, VaultMetadata } from '../protocol/merstab';
import { PublicKey } from '@solana/web3.js';
import { useMerstab } from '../contexts/merstab';
import * as anchor from '@project-serum/anchor';

export interface VaultCardProps {
    client: MerstabClient | null;
    depositMint: PublicKey;
    mTokenMint: PublicKey;
    vault: PublicKey;
}

const VaultCard = (props: VaultCardProps) => {
    const wallet = useWallet();

    const [availableDepositToken, setAvailableDepositToken] = useState<number>(0);
    const [vaultDeposits, setVaultDeposits] = useState<number>(0);
    const [vaultDecimals, setVaultDecimals] = useState<number>(0);

    const [mTokenMint, setMToken] = useState<number>(0);
    const [vaultMetadata, setVaultMetadata] = useState<VaultMetadata>({
        manager: PublicKey.default,
        mint: PublicKey.default,
        name: "",
        limit: new anchor.BN(0),
    } as VaultMetadata);

    const { client } = useMerstab();

    const [vaultBar, setVaultBar] = useState<number>(0);
    const [vaultCap, setVaultCap] = useState<number>(0);

    useEffect(() => {
        const bar = (vaultDeposits * 10 ** vaultDecimals / vaultMetadata.limit.toNumber()) * 100;
        setVaultBar(bar);
        setVaultCap(vaultMetadata.limit.toNumber() / 10 ** vaultDecimals);
    }, [vaultDeposits, vaultDecimals, vaultMetadata])

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
                    setVaultDecimals(balance?.value?.decimals);
                } else {
                    setAvailableDepositToken(0);
                }
            } else {
                setAvailableDepositToken(0);
            }
        } catch (e) {
            console.log('Error fetching deposit token balances: ', e);
            setAvailableDepositToken(0);
        }

        try {
            const vaultDepositTokenAccount = await client.getVaultDepositAccount(props.vault);
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
        } catch (e) {
            console.log('Error fetching vault deposit token balances: ', e);
            setVaultDeposits(0);
        }

        try {
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
        } catch (e) {
            console.log('Error fetching merstab deposit token balances: ', e);
            setMToken(0);
        }
    }, [client, props.depositMint, props.mTokenMint]);

    useEffect(() => {
        fetchBalances();

        const fetchVault = async () => {
            if (!client || !wallet || !wallet.publicKey) {
                console.log(`One of the following are undefined: ${client}, ${wallet}`);
                return
            };

            try {
                const vault = await client.getVaultData(props.vault);
                if (vault) {
                    setVaultMetadata(vault as VaultMetadata);
                    console.log(vault);
                } else {
                    console.log('No vault account');
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchVault();
    }, [client, fetchBalances, props.vault, wallet]);

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
                            percent={vaultBar}
                            showInfo={false} />
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                        <span>Capacity</span>
                        <span>{vaultCap} USDC</span>
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