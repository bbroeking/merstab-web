import { Col, Row } from 'antd'
import React from 'react'
import styles from '../styles/VaultPerformanceInfo.module.css';
import MetricTile from './MetricTile';

export interface VaultMetric {
    metric: string,
    metricTitle: string
}
const VaultPerformanceInfo = () => {

    // fetch data when available
    const data: VaultMetric[] = [
        { metric: '8.44%', metricTitle: 'Mth. Avg Ret.' },
        { metric: '108.42%', metricTitle: 'Market returns' },
        { metric: '36.36%', metricTitle: 'Loss MM' },
        { metric: '-9.54%', metricTitle: 'MaxDD' },
        { metric: '51.49%', metricTitle: 'Win (%)' },
        { metric: '336', metricTitle: 'Total Trades' },
        { metric: '3.58', metricTitle: 'Sharpe Ratio' },
        { metric: '2.39', metricTitle: 'Profit Factor' },
        { metric: '4.12%', metricTitle: 'Avg Win' },
        { metric: '-1.53%', metricTitle: 'Avg Loss' },
        { metric: '126.65%', metricTitle: 'Long Returns' },
        { metric: '0%', metricTitle: 'Short Returns' },
        { metric: '1d 14h', metricTitle: 'Avg Exposure' },
    ]
    // fetch
    const apy = "22.1%";
    return (
        <Row gutter={[16, 16]} className={styles.vaultPerformanceInfo}>
            <Col className={styles.performance} span={12}>
                <div className={styles.vaultPerformance}>VAULT PERFORMACE</div>
                <div style={{ display: 'flex', alignItems: 'center'}}>
                    <div style={{ marginRight: 4, fontSize: 60 }}>{apy}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 8 }}>
                        <div style={{ fontSize: 16 }}>Projected</div>
                        <div style={{ fontSize: 16 }}>APY</div>
                    </div>
                </div>
            </Col>
            <Col className={styles.metrics} span={12}>
                {data.map((vaultMetric: VaultMetric) => {
                    return <MetricTile {...vaultMetric}> </MetricTile>;
                })}
            </Col>
        </Row>
    )
}

export default VaultPerformanceInfo
