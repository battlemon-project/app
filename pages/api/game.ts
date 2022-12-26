// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  answer: any,
  result: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(JSON.stringify(req.body))
  const result = await fetch('https://game.battlemon.com/sui', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });

  const answer = await result.json();

  res.status(200).json({ answer: answer, result: result.status })
}
