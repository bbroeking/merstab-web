import { Col, Progress, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from '../styles/VaultDepositsInfo.module.css';
import Image from 'next/image';
import * as anchor from '@project-serum/anchor';
import { MerstabClient, Wallet } from '../protocol/merstab';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const VAULT_CAPACITY = 100;
const VaultDepositsInfo = () => {
    const connection = useConnection();
    const wallet = useWallet();
    const [merstabClient, setMerstabClient] = useState<MerstabClient>();
    const [vaultValue, setVaultValue] = useState<number>(0);

    useEffect(() => {
        const setupClient = async () => {
            const provider = new anchor.Provider(connection.connection, wallet as Wallet, anchor.Provider.defaultOptions());
            const client = await MerstabClient.connect(provider, true);
            const vaultValue = await client.getVaultValue();
            setMerstabClient(client);
            setVaultValue(vaultValue);
        }
        setupClient();
    }, []);

    return (
        <div className={styles.vaultDepositInfo}>
            <div className={styles.infoAssetIcon}>
                <Image src="/svg/btcperp.svg" alt='bitcoin and usdc pair' width={120} height={120}></Image>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20}}>
                <span style={{ fontSize: '46px', color: '#FFF' }}>BTC-PERP</span>
                <span>Perpetual Futures Market Making Vault</span>
                </div>
            </div>

            <Col className={styles.vaultDepositsStatus}>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8}}>
                    <span className={styles.depositInfo}>CURRENT VAULT DEPOSITS</span>
                    <span className={styles.depositInfo}>{vaultValue} USDC</span>
                </Row>
                <Row>
                    <Progress 
                        strokeColor='#DC5355' 
                        strokeLinecap='square' 
                        trailColor='#1A1A1A'
                        percent={(vaultValue / VAULT_CAPACITY ) * 100} 
                        showInfo={false} />
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8}}>
                    <span className={styles.depositInfo}>VAULT CAPACITY</span>
                    <span className={styles.depositInfo}>{VAULT_CAPACITY} USDC</span>
                </Row>
            </Col>
        </div>
    )
}

export default VaultDepositsInfo
