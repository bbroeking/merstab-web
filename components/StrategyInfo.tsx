import React from 'react'
import styles from '../styles/StrategyInfo.module.css';

const StrategyInfo = () => {
    return (
        <div className={styles.infoSection}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 40}}>
                <span>STRATEGY</span>
                <span>Merstab aims to provide market stability for the emerging DeFi industry. During the summer we have seen one of the largest market crashes in the history of Crypto markets. Mainly caused by derivatives. Thus, we aim to bring stability to the derivatives market.</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', padding: 40}}>
                <span>RISKS</span>
                <span>Merstab aims to provide market stability for the emerging DeFi industry. During the summer we have seen one of the largest market crashes in the history of Crypto markets. Mainly caused by derivatives. Thus, we aim to bring stability to the derivatives market.</span>
            </div>
        </div>
    )
}

export default StrategyInfo
