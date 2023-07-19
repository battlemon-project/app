// import { type ItemType } from './lemonStore';
import ACCESS_KEY_CONTRACT_SOL from './abi/AccessKey.json';
// import REFERRAL_CONTRACT_SOL from './abi/Referral.json';
export const ACCESS_KEY_CONTRACT_ADDRESS: `0x${string}` =
  '0x81DEE4AE98De076aa97b20a1F0c932b7D0F9Ff94';
export const GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0x027e682024A0A4Bdac25b1098bCa0D30bef4Bb8E';
export const REFERRAL_CONTRACT_ADDRESS: `0x${string}` =
  '0xF05e54f4e2716448b7579573d72B7e6D8A9c84a2';
export const PICK_AXE_CONTRACT_ADDRESS: `0x${string}` =
  '0x05B70A9DC808293fe9c98A5977250Ac2E965d72a';

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
