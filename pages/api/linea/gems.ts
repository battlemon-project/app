// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NftType } from '../../../helpers/graphql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address = req.query.address as string;

  const response = await fetch(
    'https://thegraph.goerli.zkevm.consensys.net/subgraphs/name/knobs/erc721',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
        token721S(where: {
          owner: "${address}",
          collection_: {
            name: "Lemon Gem"
          }
        }) {
          id
          tokenId
        }
      }`,
      }),
    }
  );

  const result = await response.json();

  if (!result?.data?.token721S)
    res.status(200).json({ error: 'data is wrong' });

  res.status(200).json({ result: result });
}
