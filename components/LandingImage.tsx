import React from 'react';
import Image from 'next/image';
import styles from '../styles/LandingImage.module.css';

const LandingImage = () => {
    const inlineStyle = {
        marginTop: 200,
    }
    return (
        <div>
            <Image
                className={styles.landingImage}
                src="/wave.jpg"
                alt='waves'
                layout='fill'
            ></Image>
        </div>)
};

export default LandingImage;
