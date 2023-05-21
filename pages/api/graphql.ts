// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const result = await fetch('https://api.battlemon.com/v1/graphql', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     query: req.body
  //   })
  // });

  // let json = await result.json()
  // json.data?.nfts?.reverse();
  // res.status(200).json(json)

  res.status(200).json({
    data: {
      nfts: [],
    },
  });
}
