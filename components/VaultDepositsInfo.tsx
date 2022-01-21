import { Col, Progress, Row } from 'antd'
import React from 'react'
import styles from '../styles/VaultDepositsInfo.module.css';

const VaultDepositsInfo = () => {

    return (
        <div className={styles.vaultDepositInfo}>
            <div className={styles.infoAssetIcon}>
                <img src="svg/bitcoin.svg" alt="bitcoin" />
                <span style={{ paddingLeft: '20px', fontSize: '96px' }}>BTC</span>
            </div>

            <Col className={styles.vaultDepositsStatus}>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8}}>
                    <span>CURRENT VAULT DEPOSITS</span>
                    <span>20 BTC</span>
                </Row>
                <Row>
                    <Progress 
                        strokeColor='#F7931A' 
                        strokeLinecap='square' 
                        trailColor='#1A1A1A'
                        percent={75} 
                        showInfo={false} />
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8}}>
                    <span>VAULT CAPACITY</span>
                    <span>100 BTC</span>
                </Row>
            </Col>

        </div>
    )
}

export default VaultDepositsInfo
