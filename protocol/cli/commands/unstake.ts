import { Keypair } from "@solana/web3.js";
import { initialize } from "./initialize";
import * as anchor from '@project-serum/anchor';

export async function unstake(env: string, wallet: Keypair, amount: number) {
    const merstabClient = await initialize(env, wallet);
    console.log(`Unstaking from vault`);
    return await merstabClient.unstake(new anchor.BN(amount), wallet.publicKey, null, wallet);
}