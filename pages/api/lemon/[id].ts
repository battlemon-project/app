// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NftType } from '../../../helpers/graphql';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const lemonId = req.query.id as string;

  const response = await fetch('https://api.battlemon.com/v1/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          nft(id: "${lemonId}") {
            id,
            type,
            owner,
            url,
            traits {
              type: name,
              flavour
            },
            items {
              traits {
                type: name,
                flavour
              }
            }
          }
        }
      `,
    }),
  });

  const result: { data: { nft: NftType } } = await response.json();
  const nft = result?.data?.nft;

  if (!nft)
    res.status(200).json({ error: 'not exist (smart contract was changed)' });

  res.status(200); // .json(lemon)
}
