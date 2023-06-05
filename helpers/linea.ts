// import { type ItemType } from './lemonStore';
import ACCESS_KEY_CONTRACT_SOL from './abi/AccessKey.json';
import FREE_GEMS_CONTRACT_SOL from './abi/FreeGem.json';
// import REFERRAL_CONTRACT_SOL from './abi/Referral.json';
import { utils } from 'ethers';

export const ACCESS_KEY_CONTRACT_ADDRESS: `0x${string}` =
  '0x1edbB12b64612084B2e5464DB1224f9447c4eC76';
export const GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0xc46402bF6Af1c944A6161eaC80914abA3feC9050';
export const REFERRAL_CONTRACT_ADDRESS: `0x${string}` =
  '0xc8977DCdBF9f5cc41A2707A4C4929c75374bdF19';
export const FREE_GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0xd95Cb6230C45E98F614333534fB7F79176Be6367';

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
  console.log(args);
  return {
    address: ACCESS_KEY_CONTRACT_ADDRESS,
    abi: ACCESS_KEY_CONTRACT_SOL.abi,
    functionName: 'proxyMint',
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
