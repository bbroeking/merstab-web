import { Connection } from '@solana/web3.js';
import React, { FC, useContext, useEffect, useState } from 'react'
import * as anchor from "@project-serum/anchor";
import { useWallet } from '@solana/wallet-adapter-react';
import { MerstabClient, Wallet } from '../protocol/merstab';

export interface MerstabContext {
  provider: anchor.AnchorProvider | null,
  client: MerstabClient | null
}

const MerstabContext = React.createContext<MerstabContext>(null!);

export const useMerstab = () => {
  return useContext(MerstabContext);
}

export interface MerstabProviderProps {
  env: string
}

export const MerstabProvider: FC<MerstabProviderProps> = ({children, env}) => {
  const [provider, setProvider] = useState<anchor.AnchorProvider | null>(null);
  const [client, setClient] = useState<MerstabClient | null>(null);

  const wallet = useWallet();

  useEffect(() => {
    if (!wallet) return;
    setupMerstab(env);
  }, [wallet])

  const setupMerstab = async (env: string) => {
    const connection = env === 'devnet' ? new Connection("https://api.devnet.solana.com") : new Connection('http://localhost:8899');
    const anchorProvider = new anchor.AnchorProvider(connection, wallet as Wallet, { skipPreflight: false });
    const merstab = await MerstabClient.connect(anchorProvider, env);

    setProvider(anchorProvider);
    setClient(merstab);
  }

  return (
    <MerstabContext.Provider
      value={{
        provider,
        client
      }}>
      {children}
      </MerstabContext.Provider>
  )
}