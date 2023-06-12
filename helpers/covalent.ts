import { GEMS_CONTRACT_ADDRESS } from './linea';

export const getBalance = async (address: string) => {
  const data = await fetch(
    `/api/covalent?url=/v1/linea-testnet/address/0x6A9ee69B6781C18164ee9F7C58f1763BcFfC7c51/balances_v2/?nft=true&no-nft-fetch=true`,
    {
      method: 'GET',
    }
  );
  const result = await data.json();
  console.log(result);
};

export const getGems = async (address: string) => {
  const data = await fetch(
    `/api/covalent?url=/v1/linea-testnet/address/${address}/collection/${GEMS_CONTRACT_ADDRESS}/`,
    {
      method: 'GET',
    }
  );
  const result = await data.json();
  console.log(result);
};
