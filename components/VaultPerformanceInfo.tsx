import { Col, Row } from 'antd'
import React from 'react'
import styles from '../styles/VaultPerformanceInfo.module.css';
import MetricTile from './MetricTile';

export interface VaultMetric {
    key: number,
    metric: string,
    metricTitle: string
}
const VaultPerformanceInfo = () => {

    // fetch data when available
    const data: VaultMetric[] = [
        { key: 0, metric: '8.44%', metricTitle: 'Mth. Avg Ret.' },
        { key: 1, metric: '108.42%', metricTitle: 'Market returns' },
        { key: 2, metric: '36.36%', metricTitle: 'Loss MM' },
        { key: 3, metric: '-9.54%', metricTitle: 'MaxDD' },
        { key: 4, metric: '51.49%', metricTitle: 'Win (%)' },
        { key: 5, metric: '336', metricTitle: 'Total Trades' },
        { key: 6, metric: '3.58', metricTitle: 'Sharpe Ratio' },
    ];

    const data2: VaultMetric[] = [
        { key: 7, metric: '2.39', metricTitle: 'Profit Factor' },
        { key: 8, metric: '4.12%', metricTitle: 'Avg Win' },
        { key: 9, metric: '-1.53%', metricTitle: 'Avg Loss' },
        { key: 10, metric: '126.65%', metricTitle: 'Long Returns' },
        { key: 11, metric: '0%', metricTitle: 'Short Returns' },
        { key: 12, metric: '1d 14h', metricTitle: 'Avg Exposure' },
    ];

    // fetch
    const apy = "22.1%";
    return (
        <Row gutter={[16, 16]} className={styles.vaultPerformanceInfo}>
            <Col className={styles.performance} span={12}>
                <div className={styles.vaultPerformance}>VAULT PERFORMACE</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: 4, fontSize: 60 }}>{apy}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 8 }}>
                        <div style={{ fontSize: 16 }}>Projected</div>
                        <div style={{ fontSize: 16 }}>APY</div>
                    </div>
                </div>
            </Col>
            <Col className={styles.metrics} span={12}>
                <div className={styles.metricRow}>
                    {data.map((vaultMetric: VaultMetric) => {
                        return (<div key={vaultMetric.key} style={{ flexGrow: 1}}>
                            <MetricTile {...vaultMetric}> </MetricTile>
                        </div>)
                    })}
                </div>
                <div className={styles.metricRow}>
                    {data2.map((vaultMetric: VaultMetric) => {
                        return (<div key={vaultMetric.key} style={{ flexGrow: 1}}>
                            <MetricTile {...vaultMetric}> </MetricTile>
                        </div>)
                    })}
                </div>

            </Col>
        </Row>
    )
}

export default VaultPerformanceInfo
