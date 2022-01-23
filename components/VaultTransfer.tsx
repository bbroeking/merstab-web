import { useGateway, GatewayStatus } from '@civic/solana-gateway-react';
import { Button, Col, Input, Row } from 'antd';
import React, { useState } from 'react'
import styles from '../styles/VaultTransfer.module.css';
import Image from 'next/image';

const VaultTransfer = () => {
    const [amount, setAmount] = useState(0);
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
                        <Image className={styles.currencyIcon} src='/svg/usdc.svg' width={30} height={30}></Image>
                        <div className={styles.spacer}></div>
                    </div>
                </Row>
                <Row className={`${styles.walletBalanceRow} ${styles.walletBalance}`}>
                    <Row>Wallet balance: </Row>
                    <Row><span>0.0 USDC</span></Row>
                </Row>
                <Row className={styles.displayRow}>
                    <Button
                        className={styles.actionButton}
                        disabled={GatewayStatus[gatewayStatus] !== "ACTIVE"}>
                        {depositActive ? "DEPOSIT" : "WITHDRAW"}
                    </Button>
                </Row>
                <Row className={styles.bottomRow}>
                    <span className={styles.fundsProcessingRow}>Funds are processed at 12:00AM UTC</span>
                </Row>
            </div>
        </div>
    )
}

export default VaultTransfer
