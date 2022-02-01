import React from 'react'
import { useMediaQuery } from 'react-responsive';
import LandingImage from '../components/LandingImage';
import StrategyInfo from '../components/StrategyInfo';
import VaultDepositsInfo from '../components/VaultDepositsInfo';
import VaultPerformanceInfo from '../components/VaultPerformanceInfo';
import VaultTransfer from '../components/VaultTransfer';
import styles from '../styles/Vault.module.css';

const Vault = () => {
    const isDesktop = useMediaQuery({
        query: '(min-width: 770px)'
    })
    return (<div className={styles.vaultPageWrapper}>
        <div className={styles.vimeoWrapper}>
            <iframe src="https://player.vimeo.com/video/671789697?background=1&autoplay=1&loop=1&byline=0&title=0" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
        </div>
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
