// import { type ItemType } from './lemonStore';
import ACCESS_KEY_CONTRACT_SOL from './abi/AccessKey.json';
// import REFERRAL_CONTRACT_SOL from './abi/Referral.json';
export const ACCESS_KEY_CONTRACT_ADDRESS: `0x${string}` =
  '0x991cF06Ec39703dA653DB4e45CFFeB90e4cF2fAE';
export const GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0x508774e9EC4E36aAbD63Be9A9E3C079A12269DBd';
export const REFERRAL_CONTRACT_ADDRESS: `0x${string}` =
  '0x27eEF9466dc2218bD46025D2D9b4c22B717ac8bD';
export const PICK_AXE_CONTRACT_ADDRESS: `0x${string}` =
  '0x1Fd0e6Fa0adC9826fC89B0aDc5C2135ff28Bc18C';
  
export interface IProxyMintArgs {
  mintRequest: {
    amount: number;
    nonce: string | number;
    sender: string;
    proxy: string;
  };
  signature: string;
  error?: string;
  message?: string;
}

export const proxyMintAccessKey = (args: IProxyMintArgs | boolean) => {
  if (typeof args !== 'object' || !args.mintRequest || !args.signature) return;
  return {
    address: ACCESS_KEY_CONTRACT_ADDRESS,
    abi: ACCESS_KEY_CONTRACT_SOL.abi,
    functionName: 'proxyMint',
    chainId: 59140,
    args: [
      [
        args.mintRequest.sender,
        args.mintRequest.proxy,
        args.mintRequest.amount,
        args.mintRequest.nonce,
      ],
      args.signature,
    ],
  };
};
