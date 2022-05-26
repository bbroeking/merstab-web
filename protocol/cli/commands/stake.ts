import { Keypair } from "@solana/web3.js";
import { initialize } from "./initialize";
import * as anchor from '@project-serum/anchor';

export async function stake(env: string, wallet: Keypair, amount: string) {
    const merstabClient = await initialize(env, wallet);
    console.log(`Staking to vault`);
    return await merstabClient.stake(new anchor.BN(amount), wallet.publicKey, wallet);
}