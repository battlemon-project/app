// import { type ItemType } from './lemonStore';
import ACCESS_KEY_CONTRACT_SOL from './abi/AccessKey.json';
// import REFERRAL_CONTRACT_SOL from './abi/Referral.json';
export const ACCESS_KEY_CONTRACT_ADDRESS: `0x${string}` =
  '0x8f9A6334A328e6dC621c4696b0bc096Aa7b2C429';
export const GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0x83d162CBb3F55998A1bbfb74D3051b90033dFe76';
export const REFERRAL_CONTRACT_ADDRESS: `0x${string}` =
  '0x32178Ff7179d2075BE73Ae729cE20dc675ec13b7';
export const PICK_AXE_CONTRACT_ADDRESS: `0x${string}` =
  '0xC0ECeb93c30B5D048595434c34B9903A40B928ed';
  
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
