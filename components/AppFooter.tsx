import React from 'react'
import styles from '../styles/AppFooter.module.css';

const AppFooter = () => {
    return (
        <div className={styles.footerRow}>
            <div className={styles.title}>Merstab</div>
            <div className={styles.icons}>
                <img src="svg/medium.svg" alt="medium icon" height={24} width={24} />
                <img src="svg/twitter.svg" alt="twitter icon" height={24} width={24} />
                <img src="svg/discord.svg" alt="discord icon" height={24} width={24} />
                <img src="svg/gitbook.svg" alt="gitbook icon" height={24} width={24} />
            </div>
        </div>
    )
}

export default AppFooter
