import { Col, Row } from 'antd'
import React from 'react'
import styles from '../styles/VaultPerformanceInfo.module.css';

const VaultPerformanceInfo = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Row className={styles.sectionHeader}>VAULT PERFORMANCE</Row>
            <Row style={{ display: 'flex', height: 100 }}>
                <Col className={styles.dataEntry} flex={2}>
                    <div className={styles.apyWrapper}>
                        <Row className={styles.apy}>22.1%</Row>
                        <Row>Projected APY</Row>
                    </div>
                </Col>
                <Col className={styles.dataEntry} flex={3}>
                    <Row>
                        <div className={styles.topInfo}>20% Net Profit</div>
                        <div>10% Exposure</div>
                    </Row>
                    <Row>
                        <div className={styles.topInfo}>10.3k trades</div>
                        <div>8.1k winners</div>
                    </Row>
                    <Row>
                        <div className={styles.topInfo}>1.6 SOL Tx Costs</div>
                        <div>2.2k losers</div>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default VaultPerformanceInfo
