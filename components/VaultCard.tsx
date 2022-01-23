import React from 'react';
import styles from '../styles/VaultCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Progress, Row } from 'antd';

const VaultCard = () => {
    return (
        <Link href='/vault'>
            <div className={styles.vaultCard}>
                <Row className={styles.assetInfo}>
                    <div className={styles.spacer}></div>
                    <Image src="/svg/bitcoinUsdcPair.svg" alt='bitcoin and usdc pair' width={60} height={60}></Image>
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                        <span style={{ fontSize: '24px' }}>BTC</span>
                        <span>Perpetual Future Vault</span>
                    </div>
                </Row>

                <Row>
                    <div className={styles.apyWrapper}>
                        <Row className={styles.apy}>22.1%</Row>
                        <Row>Projected APY</Row>
                    </div>
                </Row>

                <Col className={styles.vaultDepositsStatus}>
                    <Row style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                        <span>Deposits</span>
                        <span>80 USDC</span>
                    </Row>
                    <Row>
                        <Progress
                            strokeColor='#2775CA'
                            strokeLinecap='square'
                            trailColor='#474747'
                            percent={80}
                            showInfo={false} />
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                        <span>Capacity</span>
                        <span>100 USDC</span>
                    </Row>
                </Col>

                <Row className={styles.positionRow}>
                    <Col>Your position:</Col>
                    <Col>0.0 USDC</Col>
                </Row>
            </div>
        </Link>)
};


export default VaultCard;
