import { Button, Col, Progress, Row } from 'antd';
import type { NextPage } from 'next';
import Image from 'next/image';
import styles from "../styles/index.module.css";
import Link from 'next/link';
import LandingImage from '../components/LandingImage';
import LandingVideo from '../components/LandingVideo';
import { useMediaQuery } from 'react-responsive';

const Home: NextPage = () => {
    const isDesktop = useMediaQuery({
        query: '(min-width: 770px)'
    })
    return (
        <div>
            <Col className={styles.homeColumn}>
                <Row className={styles.flexRow} style={{ paddingBottom: 700 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', margin: '0 60px', justifyContent: 'center', alignItems: 'center' }}>
                        <div className={styles.earnYieldHeader}>Earn Yield On Your Crypto Assets With Fully-automated DeFi Trading Strategies</div>
                        <Link href='/overview'><Button className={styles.yieldButton}>START EARNING</Button></Link>
                    </div>
                </Row>
                {isDesktop ? <LandingVideo></LandingVideo> : <LandingImage></LandingImage>}
                <h2 className={styles.ourMissionLine}><span className={styles.lineSpan}>THE MISSION</span></h2>
                <Row className={styles.flexRow}>
                    <div className={styles.flexColumn}>
                        <div className={styles.sectionHeader}>Stabilizing the DeFi Derivatives Market Through Optimizing Market Inefficiencies</div>
                        <div className={styles.text} style={{ width: 'unset', paddingBottom: 10 }}>We believe DeFi will become the underlying core infrastructure of the global financial market. Our mission is to help the industry achieve a higher level of adoption by optimizing market inefficiencies. </div>
                        <Button className={styles.learnMore}>LEARN MORE</Button>
                    </div>
                </Row>
                <h2 className={styles.line}></h2>
                <Row className={styles.flexRow}>
                    <div className={styles.flexColumn}>
                        <h3 style={{ paddingBottom: 60 }}>OUR PRODUCTS</h3>
                        <div className={styles.ourProductsSection}>
                            <div className={`${styles.text} ${styles.flexColumn}`}>
                                <h1 className={styles.perpHeader}>BTC-PERP</h1>
                                <div className={styles.btcPerpDescription}>Generates yield through deploying a market making strategy on Mango Markets</div>
                            </div>
                            <div className={styles.marketMakingVault}>
                                <div className={styles.vaultHeader} style={{ alignSelf: 'center', paddingBottom: 20 }}>Market Making Vault</div>
                                <Image src="/svg/btcperp.svg" alt='bitcoin and usdc pair' width={180} height={180}></Image>
                                <div className={styles.apy}>22.1% <span className={styles.vaultText}>Projected Apy</span></div>
                                <div>
                                    <Row style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                                        <span className={styles.vaultText}>Deposits</span>
                                        <span className={styles.vaultText}>223,601 USDC</span>
                                    </Row>
                                    <Progress
                                        strokeColor='#D74B5E'
                                        strokeLinecap='square'
                                        trailColor='#474747'
                                        percent={23}
                                        showInfo={false} />
                                    <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                                        <span className={styles.vaultText}>Capacity</span>
                                        <span className={styles.vaultText}>1,000,000 USDC</span>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
                <Row className={styles.teamSection}>
                    <div>
                        <h1 className={styles.teamHeader}>THE TEAM</h1>
                        <div className={styles.teamText}>Here at Merstab, we work hard to build a decentralized infrastructure that helps stabilize the DeFi derivatives market at an early stage by providing liquidity more efficiently.</div>
                        <div className={styles.teamText}>Our team of quants, DevOps specialists, on-chain developers, and market analysts came together to build an infrastructure that provides better returns to investors and optimizes market inefficiencies.</div>
                        <Button className={styles.yieldButton}>CONTACT US</Button>

                    </div>
                    <div>
                        <Image src="/svg/logo.svg" alt='merstab logo' width={400} height={400}></Image>
                    </div>
                </Row>
            </Col>

        </div>
    );
};

export default Home;
