import { useWallet } from '@solana/wallet-adapter-react'
import React from 'react'

const Vault = () => {
    const solana = useWallet();
    return (
        <div>
            VAULT
        </div>
    )
}

export default Vault
