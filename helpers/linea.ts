// import { type ItemType } from './lemonStore';
import ACCESS_KEY_CONTRACT_SOL from './abi/AccessKey.json';
// import REFERRAL_CONTRACT_SOL from './abi/Referral.json';

export const ACCESS_KEY_CONTRACT_ADDRESS: `0x${string}` =
  '0x77dD7316C9bf899790B948698F0c98a317ef9140';
export const GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0x6bF309Ad2b7c0eBE44e69a53Bb2cCED79f17FC66';
export const REFERRAL_CONTRACT_ADDRESS: `0x${string}` =
  '0x15Ed5594ed40e9c4f8aA4342077ef0b3a1820B5a';
export const FREE_GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0x35D42D4BdC36CfE33A5ea6672A1B81752A963d6d';
export const PICK_AXE_CONTRACT_ADDRESS: `0x${string}` =
  '0x8d0a883079f5eBBF0C7bDc66415360e838966957';

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
