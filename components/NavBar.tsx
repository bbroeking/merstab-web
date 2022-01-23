import { ButtonMode, IdentityButton } from '@civic/solana-gateway-react';
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import styles from '../styles/NavBar.module.css';
import CivicVerification from './CivicVerification';

const NavBar = () => {
    const wallet = useWallet();
    const router = useRouter();
    return (
        <div className={styles.navRow}>
            <div className={styles.icon}>

            </div>

            <div className={styles.navTabs}>
                <Link href={'/'} >
                    <a className={`${styles.navItem} ${router.pathname == "/" ? styles.active : ""}`} >Home</a>
                </Link>
                <Link href={'vault'}>
                    <a className={`${styles.navItem} ${router.pathname == "/vault" ? styles.active : ""}`} >Vault</a>
                </Link>
            </div>

            <div className={styles.connectWallet}>
                { wallet.publicKey && <CivicVerification />
}
                <WalletMultiButton 
                    startIcon={<img src="svg/wallet.svg" alt="wallet icon" height={8} width={8} />}
                    className={styles.walletButton}>
                        {wallet.connected ?
                         `...${wallet.publicKey?.toString().slice(-4)}` : 
                         'Connect Wallet'}
                </WalletMultiButton>

            </div>

        </div>
    )
}

export default NavBar
