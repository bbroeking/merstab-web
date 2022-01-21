import { useWallet } from '@solana/wallet-adapter-react'
import React from 'react'
import StrategyInfo from '../components/StrategyInfo';
import VaultDepositsInfo from '../components/VaultDepositsInfo';
import VaultPerformanceInfo from '../components/VaultPerformanceInfo';
import VaultTransfer from '../components/VaultTransfer';
import styles from '../styles/Vault.module.css';

const Vault = () => {
    const solana = useWallet();
    return (
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
    )
}

export default Vault
