import { Col, Progress, Row } from 'antd'
import React from 'react'
import styles from '../styles/VaultDepositsInfo.module.css';

const VaultDepositsInfo = () => {

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', height: '100%'}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="svg/bitcoin.svg" alt="bitcoin" />
                <span style={{ paddingLeft: '20px', fontSize: '96px' }}>BTC</span>
            </div>

            <Col style={{flex: '0 0 40%', alignSelf: 'center'}}>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8}}>
                    <span>CURRENT VAULT DEPOSITS</span>
                    <span>20 BTC</span>
                </Row>
                <Row>
                    <Progress 
                        strokeColor='#F7931A' 
                        strokeLinecap='square' 
                        trailColor='#1A1A1A'
                        percent={75} 
                        showInfo={false} />
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8}}>
                    <span>VAULT CAPACITY</span>
                    <span>100 BTC</span>
                </Row>
            </Col>

        </div>
    )
}

export default VaultDepositsInfo
