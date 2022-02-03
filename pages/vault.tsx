import React, { useState } from 'react'
import StrategyInfo from '../components/StrategyInfo';
import VaultDepositsInfo from '../components/VaultDepositsInfo';
import VaultPerformanceInfo from '../components/VaultPerformanceInfo';
import VaultTransfer from '../components/VaultTransfer';
import styles from '../styles/Vault.module.css';
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Vault = () => {
    const DynamicBackgroundNoSSR = dynamic(
        () => import('../components/Background'),
        { ssr: false }
    )
    return (
        <>
            <div className={styles.vaultPageWrapper}>
            <DynamicBackgroundNoSSR></DynamicBackgroundNoSSR>

                <div className={styles.vaultSection}>

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
            <ToastContainer></ToastContainer>
        </>

    )
}

export default Vault
