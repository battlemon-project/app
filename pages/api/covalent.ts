// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
  result: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let headers = new Headers();
  headers.set('Authorization', `Bearer ${process.env.COVALENT_API}`);
  headers.set('Content-Type', 'application/json');

  const data = await fetch(`https://api.covalenthq.com${req.query.url}`, {
    method: 'GET',
    headers: headers,
  });
  const result = await data.json();

  res.status(200).json({ result: result });
}
