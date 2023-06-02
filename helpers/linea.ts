// import { type ItemType } from './lemonStore';
import ACCESS_KEY_CONTRACT_SOL from './abi/AccessKey.json';
import FREE_GEMS_CONTRACT_SOL from './abi/FreeGem.json';
// import REFERRAL_CONTRACT_SOL from './abi/Referral.json';
import { utils } from 'ethers';

export const ACCESS_KEY_CONTRACT_ADDRESS: `0x${string}` =
  '0x5106184572660c48B86e276eaA4bC7bD99f43d81';
export const GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0x463B24879DD0D5Dc087C452f7801509FeBe29e5D';
export const REFERRAL_CONTRACT_ADDRESS: `0x${string}` =
  '0x9307A5b9b51C3893033Ba577F6882b98405bAFcF';
export const FREE_GEMS_CONTRACT_ADDRESS: `0x${string}` =
  '0x96925cddbEF15b18c94AfF1B6bF0DcC394DeDf35';

export interface IProxyMintArgs {
  mintRequest: {
    amount: number;
    nonce: string | number;
    sender: string;
    proxy: string;
  };
  signature: string;
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

export const mintGem = (address: `0x${string}` | undefined) => {
  return {
    address: FREE_GEMS_CONTRACT_ADDRESS,
    abi: FREE_GEMS_CONTRACT_SOL.abi,
    functionName: 'mint',
    args: [address, 1],
  };
};

export const craftGems = (id1: string | null, id2: string | null) => {
  return {
    address: FREE_GEMS_CONTRACT_ADDRESS,
    abi: FREE_GEMS_CONTRACT_SOL.abi,
    functionName: 'merge',
    args: [id1, id2],
    overrides: {
      value: utils.parseEther('0.005'),
    },
  };
};
