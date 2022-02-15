import React from 'react'
import styles from '../styles/AppFooter.module.css';
import Image from 'next/image';

const AppFooter = () => {
    return (
        <div className={styles.footerRow}>
            <Image src="/svg/logo.svg" alt='merstab logo' width={60} height={60}></Image>
            <div className={styles.icons}>
                <a href='https://devpost.com/software/merstab' target="_blank" rel='noreferrer'><img src="svg/medium.svg" alt="medium icon" height={24} width={24} /></a>
                <a href='https://merstab.gitbook.io/documentation/' target="_blank" rel='noreferrer'><img src="svg/gitbook.svg" alt="medium icon" height={24} width={24} /></a>
                <a href='https://twitter.com/merstab' target="_blank" rel='noreferrer'><img src="svg/twitter.svg" alt="twitter icon" height={24} width={24} /></a>
                <a href='https://discord.gg/Nhn8YbsgaE' target="_blank" rel='noreferrer'><img src="svg/discord.svg" alt="discord icon" height={24} width={24} /></a>
            </div>
        </div>
    )
}

export default AppFooter