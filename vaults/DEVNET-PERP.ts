import { PublicKey } from "@solana/web3.js";

// NOTE THIS EXAMPLE'S LIMIT IS TOO LOW TO WORK 
export const depositMint = new PublicKey("8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN");
export const depositMintDecimals = 6;
export const mTokenMint = new PublicKey("4R3o8zz9uq917ATgDKd4rTRSZu87b3V8fhcmirLMZmLg");    
export const vault = new PublicKey("HGsoCGL13W13F67fdSs17Tv36ysovaxw62M3AxQxE2N8");

export class DevnetPerp {
    static get depositMint() {
        return depositMint;
    }

    static get depositMintDecimals() {
        return depositMintDecimals;
    }

    static get mTokenMint() {
        return mTokenMint;
    }
    
    static get vault() {
        return vault;
    }
    
    static get vaultName() {
        return "TBD";
        // return vaultName;
    }
}
