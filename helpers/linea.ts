// import { type ItemType } from './lemonStore';
import ACCESS_KEY_CONTRACT_SOL from './abi/AccessKey.json';
// import REFERRAL_CONTRACT_SOL from './abi/Referral.json';
export const ACCESS_KEY_CONTRACT_ADDRESS: `0x${string}` =
  '0x1a33dc3ABE4adD4e6e07A762304aDBB0B0be4229';
export const GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0xb701dCDEDf1Bf1c74f9D7eB8316D424537C73d31';
export const REFERRAL_CONTRACT_ADDRESS: `0x${string}` =
  '0x8998E8B0358335c48450BbB4e6249083A6784AEe';
export const FREE_GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0x35D42D4BdC36CfE33A5ea6672A1B81752A963d6d';
export const PICK_AXE_CONTRACT_ADDRESS: `0x${string}` =
  '0xceCCd0A22170878C2ee32336B85c31CAb48e67B4';

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
