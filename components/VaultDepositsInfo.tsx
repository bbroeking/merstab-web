import { Col, Progress, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from '../styles/VaultDepositsInfo.module.css';
import Image from 'next/image';
import * as anchor from '@project-serum/anchor';
import { useMerstab } from '../contexts/merstab';
import { PublicKey } from '@solana/web3.js';
import { VaultMetadata } from '../protocol/merstab';

export interface VaultDepositsInfoProps {
    vault: PublicKey,
}

const VaultDepositsInfo = (props: VaultDepositsInfoProps) => {
    const { client } = useMerstab();
    const [vaultDeposits, setVaultDeposits] = useState<number>(0);
    const [vaultDecimals, setVaultDecimals] = useState<number>(0);

    const [vaultMetadata, setVaultMetadata] = useState<VaultMetadata>({
        manager: PublicKey.default,
        mint: PublicKey.default,
        name: "",
        limit: new anchor.BN(0),
    } as VaultMetadata);

    const [vaultBar, setVaultBar] = useState<number>(0);
    const [vaultCap, setVaultCap] = useState<number>(0);

    useEffect(() => {
        if (!client) return;
        const fetchBalances = async () => {
            try {
                const vaultDepositTokenAccount = await client.getVaultDepositAccount(props.vault);
                if (vaultDepositTokenAccount) {
                    const balance = await client.getTokenAccountBalance(vaultDepositTokenAccount.address);
                    if (balance?.value?.uiAmount) {
                        console.log(balance?.value?.uiAmount)
                        setVaultDeposits(balance?.value?.uiAmount);
                        setVaultDecimals(balance?.value?.decimals);
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

        const fetchVault = async () => {
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
        fetchBalances();
    }, [client]);


    useEffect(() => {
        const bar = (vaultDeposits * 10 ** vaultDecimals / vaultMetadata.limit.toNumber()) * 100;
        setVaultBar(bar);
        setVaultCap(vaultMetadata.limit.toNumber() / 10 ** vaultDecimals);
    }, [vaultDeposits, vaultDecimals, vaultMetadata])

    return (
        <div className={styles.vaultDepositInfo}>
            <div className={styles.infoAssetIcon}>
                <Image src="/svg/btcperp.svg" alt='bitcoin and usdc pair' width={160} height={160}></Image>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
                    <span style={{ fontSize: '46px', color: '#FFF' }}>BTC-PERP</span>
                    <span>Perpetual Futures Market Making Vault</span>
                </div>
            </div>

            <Col className={styles.vaultDepositsStatus}>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                    <span className={styles.depositInfo}>CURRENT VAULT DEPOSITS</span>
                    <span className={styles.depositInfo}>{vaultDeposits} USDC</span>
                </Row>
                <Row>
                    <Progress
                        strokeColor='#DC5355'
                        strokeLinecap='square'
                        trailColor='#1A1A1A'
                        percent={vaultBar}
                        showInfo={false} />
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                    <span className={styles.depositInfo}>VAULT CAPACITY</span>
                    <span className={styles.depositInfo}>{vaultCap} USDC</span>
                </Row>
            </Col>
        </div>
    )
}

export default VaultDepositsInfo
