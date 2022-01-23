import { Col, Progress, Row } from 'antd'
import React from 'react'
import styles from '../styles/VaultDepositsInfo.module.css';
import Image from 'next/image';

const VaultDepositsInfo = () => {

    return (
        <div className={styles.vaultDepositInfo}>
            <div className={styles.infoAssetIcon}>
                <Image src="/svg/bitcoinUsdcPair.svg" alt='bitcoin and usdc pair' width={120} height={120}></Image>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20}}>
                <span style={{ fontSize: '66px' }}>BTC</span>
                <span>Perpetual Future Vault</span>
                </div>
            </div>

            <Col className={styles.vaultDepositsStatus}>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8}}>
                    <span>CURRENT VAULT DEPOSITS</span>
                    <span>80 USDC</span>
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
                    <span>100 USDC</span>
                </Row>
            </Col>
        </div>
    )
}

export default VaultDepositsInfo
