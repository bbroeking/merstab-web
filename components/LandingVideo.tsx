import React from 'react';
import styles from '../styles/LandingVideo.module.css';

const LandingVideo = () => {
    return <div className={styles.videoWrapper}>
        <video className={styles.video} src="https://drive.google.com/file/d/1mRe35VUBys_aIVqLJW1XbqSsHD6Zm7-6/preview" loop muted autoPlay></video>
    </div>
};

export default LandingVideo;
