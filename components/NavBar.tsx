import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import styles from '../styles/NavBar.module.css';
import CivicVerification from './CivicVerification';
import Image from 'next/image';
import { Button } from 'antd';

const NavBar = () => {
    const wallet = useWallet();
    const router = useRouter();
    return (
        <div className={router.pathname == "/" ? styles.navRow : styles.navRowBoxShadow}>
            <div className={styles.icon}>
                {/* <Link href={'/'}> */}
                <Image src="/svg/logo.svg" alt='merstab logo' width={96} height={96}></Image>
                {/* </Link> */}
            </div>
            <div className={styles.navTabs}>
                {router.pathname !== '/' ?
                    <>
                        {/* <Link href={'/'} >
                            <a className={`${styles.navItem} ${router.pathname == "/" ? styles.active : ""}`} >HOME</a>
                        </Link> */}
                        <Link href={'/overview'}>
                            <a className={`${styles.navItem} ${router.pathname !== "/" ? styles.active : ""}`} >VAULTS</a>
                        </Link>
                    </>
                    : ''
                }

            </div>
            <div className={styles.connectWallet}>
                {/* { wallet.publicKey && <CivicVerification />} */}
                {router.pathname === "/" ?
                    <Link href={'/overview'}><Button className={styles.launchApp}>LAUNCH APP</Button></Link> :
                    <WalletMultiButton
                        startIcon={<img src="svg/wallet.svg" alt="wallet icon" height={8} width={8} />}
                        className={styles.walletButton}>
                        {wallet.connected ?
                            `...${wallet.publicKey?.toString().slice(-4)}` :
                            'Connect Wallet'}
                    </WalletMultiButton>
                }
            </div>
        </div>
    )
}

export default NavBar
