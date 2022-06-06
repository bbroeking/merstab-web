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
  const depositMintDecimals = DevnetPerp.depositMintDecimals;
  const mTokenMint = DevnetPerp.mTokenMint;
  const vaultPk = DevnetPerp.vault;

  return (
    <>
      <div className={styles.vaultPageWrapper}>
        <div className={styles.vaultSection}>
          <div className={styles.vaultDeposits}>
            <VaultDepositsInfo vault={vaultPk}></VaultDepositsInfo>
          </div>
          <div className={styles.vaultPerformance}>
            <VaultPerformanceInfo></VaultPerformanceInfo>
          </div>
          <div className={styles.vaultTransactions}>
            <StrategyInfo></StrategyInfo>
            <VaultTransfer depositMint={depositMint} mTokenMint={mTokenMint} vault={vaultPk} depositMintDecimals={depositMintDecimals}></VaultTransfer>
          </div>
        </div>
        <AbstractWave></AbstractWave>
      </div>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default Vault