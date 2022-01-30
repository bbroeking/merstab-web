import React from 'react'
import styles from '../styles/StrategyInfo.module.css';

const StrategyInfo = () => {
    return (
        <div className={styles.infoSection}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 40}}>
                <span className={styles.sectionHeader}>STRATEGY</span>
                <span>"This vault accepts USDC deposits and earns yield via a market-making strategy. The strategy works by first depositing USDC on Mango Markets and then placing limit orders on buy and sell-side to earn the bid-ask spread.  In addition to that, the risk is hedged on Serum’s spot market."</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', padding: 40}}>
                <span className={styles.sectionHeader}>RISK</span>
                <span>The risk involved with market-making is called inventory risk. Inventory risk is the probability that a market maker can't find buyers for their inventory, resulting in the risk of holding more of an asset at exactly the wrong time, e.g. accumulating assets when prices are falling or selling too early when prices are rising.</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', padding: 40}}>
                <span className={styles.sectionHeader}>RISK</span>
                <span>Once user funds have been entered into the vault’s weekly strategy, they cannot be withdrawn until the vault closes it’s position the following Friday at 12pm UTC.
                        Users can withdraw their funds instantly during the weekly timelock period where the vault closes it’s previous position and opens its new position.</span>
            </div>
        </div>
    )
}

export default StrategyInfo
