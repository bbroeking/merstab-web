import { Col, Row } from 'antd';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import LandingImage from '../components/LandingImage';
import LandingVideo from '../components/LandingVideo';
import VaultCard from '../components/VaultCard';
import styles from '../styles/overview.module.css';

const Overview = () => {
    const isDesktop = useMediaQuery({
        query: '(min-width: 770px)'
    })
    return <div>
        {isDesktop ? <LandingVideo></LandingVideo> : ''}
        <Col className={styles.main}>
            <h1  className={styles.overviewHeader}>Vault Strategies</h1>
            <div className={styles.text}>Vault Strategies are pools of funds with an associated strategy for maximizing returns on the asset in the vault. </div>
            <Row className={styles.totalValueLocked}>$100,000 TVL</Row>
            <Row className={styles.vaults}>
                <VaultCard></VaultCard>
            </Row>
        </Col>
    </div>;
};

export default Overview;
