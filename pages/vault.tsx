import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import StrategyInfo from '../components/StrategyInfo';
import VaultDepositsInfo from '../components/VaultDepositsInfo';
import VaultPerformanceInfo from '../components/VaultPerformanceInfo';
import VaultTransfer from '../components/VaultTransfer';
import styles from '../styles/Vault.module.css';
import dynamic from 'next/dynamic';

const Vault = () => {
    const DynamicBackgroundNoSSR = dynamic(
        () => import('../components/Background'),
        {ssr: false}
    )
    return (
        <div className={styles.vaultPageWrapper}>
            <div className={styles.vaultSection}>
                <DynamicBackgroundNoSSR></DynamicBackgroundNoSSR>
                <div className={styles.vaultDeposits}>
                    <VaultDepositsInfo></VaultDepositsInfo>
                </div>
                <div className={styles.vaultPerformance}>
                    <VaultPerformanceInfo></VaultPerformanceInfo>
                </div>
                <div className={styles.vaultTransactions}>
                    <StrategyInfo></StrategyInfo>
                    <VaultTransfer></VaultTransfer>
                </div>
            </div>
        </div>
    )
}

export default Vault
