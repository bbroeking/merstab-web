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
            <div className={styles.text}>Vault Strategies are pools of funds with an associated strategy for maximizing returns on the asset in the vault. </div>
            <Row className={styles.totalValueLocked}>$10 TVL</Row>
            <Row className={styles.vaults}>
                <VaultCard></VaultCard>
            </Row>
        </Col>
    </div>;
};

export default Overview;
