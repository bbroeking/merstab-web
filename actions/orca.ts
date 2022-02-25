import { Connection, PublicKey } from "@solana/web3.js";
import { Orca, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";

import { getDevnetPool } from '@orca-so/sdk/dist/public/devnet';
import { OrcaPoolConfig as OrcaDevnetPoolConfigs } from "@orca-so/sdk/dist/public/devnet/pools/config";
// import { solUsdcPool } from "@orca-so/sdk/dist/constants/devnet/pools";


export const swap = async (orca: Orca, owner: PublicKey, amount: number) => {
    /*** Swap ***/
    // 3. We will be swapping 0.1 SOL for some ORCA
    
    const devnetConfig = getDevnetPool("4GpUivZ2jvZqQ3vJRsoq5PwnYv6gdV9fJ9BzHT2JcRr7" as OrcaPoolConfig);
    const whETHUSDCPool = orca.getPool(devnetConfig);
    const whETH = whETHUSDCPool.getTokenA();
    const whETHAmount = new Decimal(amount);
    const quote = await whETHUSDCPool.getQuote(whETH, whETHAmount);
    const usdcAmount = quote.getMinOutputAmount();

    console.log(`Swap ${whETHAmount.toString()} whETH for at least ${usdcAmount.toNumber()} USDC`);
    const swapPayload = await whETHUSDCPool.swap(owner, whETH, whETHAmount, usdcAmount);
    const swapTxId = await swapPayload.execute();
    console.log("Swapped:", swapTxId, "\n");
}