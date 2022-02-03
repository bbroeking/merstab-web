import React from 'react'
import styles from '../styles/StrategyInfo.module.css';

const StrategyInfo = () => {
    return (
        <div className={styles.infoSection}>
            <div style={{display: 'flex', flexDirection: 'column', padding: '32px 0'}}>
                <span className={styles.sectionHeader}>STRATEGY</span>
                <span className={styles.sectionText}>This vault accepts USDC deposits and earns yield via a market-making strategy. The strategy works by first depositing USDC on Mango Markets and then placing limit orders on buy and sell-side to earn the bid-ask spread.  In addition to that, the risk is hedged on Serum&apos;s spot market.</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', padding: '32px 0'}}>
                <span className={styles.sectionHeader}>RISK</span>
                <span className={styles.sectionText}>The risk involved with market-making is called inventory risk. Inventory risk is the probability that a market maker can&apos;t find buyers for their inventory, resulting in the risk of holding more of an asset at exactly the wrong time, e.g. accumulating assets when prices are falling or selling too early when prices are rising.</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', padding: '32px 0'}}>
                <span className={styles.sectionHeader}>WITHDRAWALS</span>
                <span className={styles.sectionText}>Once user funds have been used in the vault&apos;s strategy, they cannot be withdrawn until the vault closes its position the following day 12am UTC. Users can request their funds to be withdrawn at any time. The request will be processed the following day at 12am UTC.</span>
            </div>
        </div>
    )
}

export default StrategyInfo
