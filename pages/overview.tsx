import { Col, Row } from 'antd';
import React from 'react';
import LandingImage from '../components/LandingImage';
import VaultCard from '../components/VaultCard';
import styles from '../styles/overview.module.css';

const Overview = () => {
    return <div>
        <LandingImage></LandingImage>
        <Col className={styles.main}>
            <h1 style={{ color: "#DC5355", paddingTop: 60, fontSize: 40 }}>Get yield through a vault</h1>
            <div className={styles.text}>Merstab aims to provide market stability for the emerging DeFi industry. During the summer we have seen one of the largest market crashes in the history of Crypto markets. Mainly caused by derivatives. Thus, we aim to bring stability to the derivatives market.
                The solution is an on-chain market maker for decentralized derivatives exchanges which makes use of sophisticated market-making algorithms from the traditional finance industry. The current model of AMMs and liquidity pools arent capital efficient and pose many risks to investors.</div>
            <Row className={styles.totalValueLocked}>$10 TVL</Row>
            <Row className={styles.vaults}>
                <VaultCard></VaultCard>
            </Row>
        </Col>
    </div>;
};

export default Overview;
