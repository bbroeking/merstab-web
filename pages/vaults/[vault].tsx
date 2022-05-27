import React, { useState } from 'react'
import StrategyInfo from '../../components/StrategyInfo';
import VaultDepositsInfo from '../../components/VaultDepositsInfo';
import VaultPerformanceInfo from '../../components/VaultPerformanceInfo';
import VaultTransfer from '../../components/VaultTransfer';
import styles from '../../styles/Vault.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AbstractWave from '../../components/AbstractWave';
import { DevnetPerp } from '../../vaults/DEVNET-PERP';
import { useRouter } from 'next/router';

const Vault = () => {
  const router = useRouter();
  const { vault } = router.query;

  const depositMint = DevnetPerp.depositMint;
  const mTokenMint = DevnetPerp.mTokenMint;
  const vaultName = DevnetPerp.vaultName;

  return (
    <>
      <div className={styles.vaultPageWrapper}>
        <div className={styles.vaultSection}>
          <div className={styles.vaultDeposits}>
            <VaultDepositsInfo vaultName={vaultName}></VaultDepositsInfo>
          </div>
          <div className={styles.vaultPerformance}>
            <VaultPerformanceInfo></VaultPerformanceInfo>
          </div>
          <div className={styles.vaultTransactions}>
            <StrategyInfo></StrategyInfo>
            <VaultTransfer depositMint={depositMint} mTokenMint={mTokenMint} vaultName={vaultName} ></VaultTransfer>
          </div>
        </div>
        <AbstractWave></AbstractWave>
      </div>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default Vault