import { Button, Col, Input, Row } from 'antd';
import React, { useState } from 'react'
import styles from '../styles/VaultTransfer.module.css';

const VaultTransfer = () => {
    const [amount, setAmount] = useState(1);
    const [depositActive, setDepositActive] = useState<boolean>(true); 
    const onInputChange = (event: any) => {
        setAmount(event.target.value);
    }
    return (
        <div className={styles.transferSection}>
            <div className={styles.innerTransfer}>
                <Row className={styles.buttonRow}>
                    <Button className={`${styles.transactionButton} ${depositActive ? styles.active : ""}`}>Deposit</Button>
                    <Button className={`${styles.transactionButton} ${!depositActive ? styles.active : ""}`}>Withdraw</Button>
                </Row>
                <Row className={styles.displayRow}>
                    <Col>Your position:</Col>
                    <Col>0.0 USDC</Col>
                </Row>
                <Row>
                    <input className={styles.amountField} value={amount} onChange={onInputChange}></input>
                </Row>
                <Row className={styles.displayRow}>
                    <Row>Wallet balance: </Row>
                    <Row>0.0 USDC</Row>
                </Row>
                <Row>
                    <Button className={styles.actionButton}>DEPOSIT</Button>
                </Row>
            </div>
        </div>
    )
}

export default VaultTransfer
