import React from 'react'
import LandingImage from '../components/LandingImage';
import LandingVideo from '../components/LandingVideo';
import StrategyInfo from '../components/StrategyInfo';
import VaultDepositsInfo from '../components/VaultDepositsInfo';
import VaultPerformanceInfo from '../components/VaultPerformanceInfo';
import VaultTransfer from '../components/VaultTransfer';
import styles from '../styles/Vault.module.css';

const Vault = () => {
    return (<div>
        <LandingVideo></LandingVideo>
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

    )
}

export default Vault
