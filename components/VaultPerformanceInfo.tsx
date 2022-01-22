import { Col, Row } from 'antd'
import React from 'react'
import styles from '../styles/VaultPerformanceInfo.module.css';

const VaultPerformanceInfo = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column'}}>
            <Row className={styles.sectionHeader}>VAULT PERFORMANCE</Row>
            <Row style={{ display: 'flex', height: 100 }}>
                <Col className={styles.dataEntry} flex={2}>big</Col>
                <Col className={styles.dataEntry} flex={3}>
                    <Row>
                        <div>1</div>
                        <div>2</div>
                    </Row>
                    <Row>
                        <div>1</div>
                        <div>2</div>
                    </Row>
                    <Row>
                        <div>1</div>
                        <div>2</div>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default VaultPerformanceInfo
