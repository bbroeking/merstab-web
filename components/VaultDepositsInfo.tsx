import { Col, Progress, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from '../styles/VaultDepositsInfo.module.css';
import Image from 'next/image';
import * as anchor from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMerstab } from '../contexts/merstab';

export const VAULT_CAPACITY = 100;
export interface VaultDepositsInfoProps {
    vaultName: string
}

const VaultDepositsInfo = (props: VaultDepositsInfoProps) => {
    const { client } = useMerstab();
    const [vaultDeposits, setVaultDeposits] = useState<number>(0);

    useEffect(() => {
        if (!client) return;
        const fetchBalances = async () => {
            try {
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
            } catch (err) {
                console.log(err);
            }
        }
        fetchBalances();
    }, [client]);

    return (
        <div className={styles.vaultDepositInfo}>
            <div className={styles.infoAssetIcon}>
                <Image src="/svg/btcperp.svg" alt='bitcoin and usdc pair' width={160} height={160}></Image>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20}}>
                <span style={{ fontSize: '46px', color: '#FFF' }}>BTC-PERP</span>
                <span>Perpetual Futures Market Making Vault</span>
                </div>
            </div>

            <Col className={styles.vaultDepositsStatus}>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8}}>
                    <span className={styles.depositInfo}>CURRENT VAULT DEPOSITS</span>
                    <span className={styles.depositInfo}>{vaultDeposits} USDC</span>
                </Row>
                <Row>
                    <Progress 
                        strokeColor='#DC5355' 
                        strokeLinecap='square' 
                        trailColor='#1A1A1A'
                        percent={(vaultDeposits / VAULT_CAPACITY ) * 100} 
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
