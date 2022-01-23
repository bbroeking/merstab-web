import { useGateway, GatewayStatus } from '@civic/solana-gateway-react';
import { Button, Col, Input, Row } from 'antd';
import React, { useState } from 'react'
import styles from '../styles/VaultTransfer.module.css';

const VaultTransfer = () => {
    const [amount, setAmount] = useState(1);
    const [depositActive, setDepositActive] = useState<boolean>(true);
    const { gatewayStatus } = useGateway();
    const onInputChange = (event: any) => {
        setAmount(event.target.value);
    }
    const onTabToggle = (toggle: boolean) => {
        setDepositActive(toggle);
    }
    return (
        <div className={styles.transferSection}>
            <div className={styles.innerTransfer}>
                <Row className={styles.buttonRow}>
                    <Button
                        onClick={() => onTabToggle(true)}
                        className={`${styles.transactionButton} ${depositActive ? styles.active : ""}`}>Deposit</Button>
                    <Button
                        onClick={() => onTabToggle(false)}
                        className={`${styles.transactionButton} ${!depositActive ? styles.active : ""}`}>Withdraw</Button>
                </Row>
                <Row className={styles.positionRow}>
                    <Col>Your position:</Col>
                    <Col>0.0 USDC</Col>
                </Row>
                <Row>
                    <div className={styles.valueInputRow}>
                        <Button className={styles.maxButton}>MAX</Button>
                        <input className={styles.amountField} value={amount} onChange={onInputChange}></input>
                        <div className={styles.currency}>USDC</div>
                    </div>
                </Row>
                <Row className={`${styles.walletBalanceRow} ${styles.walletBalance}`}>
                    <Row>Wallet balance: </Row>
                    <Row>0.0 USDC</Row>
                </Row>
                <Row className={styles.displayRow}>
                    <Button
                        className={styles.actionButton}
                        disabled={GatewayStatus[gatewayStatus] !== "ACTIVE"}>
                        {depositActive ? "DEPOSIT" : "WITHDRAW"}
                    </Button>
                </Row>
            </div>
        </div>
    )
}

export default VaultTransfer
