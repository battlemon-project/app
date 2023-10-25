// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { LEMONS_CONTRACT_ADDRESS } from '../../../helpers/linea';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address = req.query.address as string;

  try {
    const response = await fetch(process.env.THEGRAPH + '/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
            user(id: "${address.toLocaleLowerCase()}") {
              id
              tokens {
                id
                tokenId: tokenID
              }
            }
          }`,
      }),
    });

    const result = await response.json();
    res.status(200).json({ result: result });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error, name: error.name, message: error.message });
  }
}
