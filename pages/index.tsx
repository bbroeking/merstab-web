import { Button, Col, Row } from 'antd';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from "../styles/index.module.css";
import Link from 'next/link';
import LandingImage from '../components/LandingImage';

const Home: NextPage = () => {
    return (
        <div>
            <LandingImage></LandingImage>
            <Col className={styles.homeColumn}>
                <Row className={styles.flexRow} style={{ paddingBottom: 400 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', margin: '0 60px' }}>
                        <div style={{ fontSize: 70, textOverflow: 'wrap' }}>Derivatives Market Making Strategy Vaults</div>
                        <Link href='/overview'><Button className={styles.yieldButton}>EARN YIELD</Button></Link>
                    </div>
                    <Image src={'/logo.png'} width={400} height={400}></Image>
                </Row>
                <h2 className={styles.line}><span className={styles.lineSpan}>OUR MISSION</span></h2>
                <Row className={styles.flexRow}>
                    <Image src={'/logo.png'} width={400} height={400}></Image>
                    <div className={styles.text}>We help stabilize the DeFi market in optimizing market inefficiencies. We believe DeFi will become the underlying core infrastructure of our global financial market. The largest market inefficiency at hand is the derivatives market, which we have all painfully experienced last summer.
                        Market making helps to stabilize inefficient markets, hence we have decided to focus our efforts on our first big goal/mission – to stabilize the DeFi derivatives market. We hope our efforts will help the DeFi industry to achieve further mass adoption. </div>
                </Row>
                <h2 className={styles.line}></h2>
                <Row className={styles.flexRow}>
                    <div className={styles.flexColumn}>
                        <h1>Yield-bearing Vaults Strategies</h1>
                        <div className={styles.text}>
                            Decentralized Finance has the potential to become a global market which democratizes access to basic financial instruments. By providing liquidity in a more efficient way to DeFi derivatives exchanges, we help to stabilize the still growing DeFi derivatives market in its early stages. Optimizing market inefficiencies will help the DeFi market to achieve wider adoption and allows a better user experience.
                        </div>
                    </div>
                    <Image src={'/logo.png'} width={400} height={400}></Image>
                </Row>
                <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '80px 0 180px 0' }}>
                    <h1>THE TEAM</h1>
                    <div style={{ paddingBottom: 20 }}>A team with background in Quant Finance, DevOps, Data Science, AI and Big Data</div>
                    <Button className={styles.yieldButton}>Contact Us</Button>
                </Row>
            </Col>

        </div>
    );
};

export default Home;
