import React from 'react'
import { useMediaQuery } from 'react-responsive';
import LandingImage from '../components/LandingImage';
import LandingVideo from '../components/LandingVideo';
import StrategyInfo from '../components/StrategyInfo';
import VaultDepositsInfo from '../components/VaultDepositsInfo';
import VaultPerformanceInfo from '../components/VaultPerformanceInfo';
import VaultTransfer from '../components/VaultTransfer';
import styles from '../styles/Vault.module.css';

const Vault = () => {
    const isDesktop = useMediaQuery({
        query: '(min-width: 770px)'
    })
    return (<div>
        {isDesktop ? <LandingVideo></LandingVideo> : <LandingImage></LandingImage>}
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
