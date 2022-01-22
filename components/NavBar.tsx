import { useWallet } from '@solana/wallet-adapter-react'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import styles from '../styles/NavBar.module.css';

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
                <WalletMultiButton 
                    startIcon={<img src="svg/wallet.svg" alt="wallet icon" height={8} width={8} />}
                    className={styles.walletButton}>
                        {wallet.connected ?
                         `... ${wallet.publicKey?.toString().slice(-4)}` : 
                         'Connect Wallet'}
                </WalletMultiButton>

            </div>

        </div>
    )
}

export default NavBar
