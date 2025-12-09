import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  const { orderId, status } = req.body;
  if (!orderId || !status) return res.status(400).json({ message: 'Missing orderId or status' });

  try {
    const result = await pool.query(`UPDATE orders SET status=$1 WHERE id=$2 RETURNING *`, [status, orderId]);
    res.status(200).json({ order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
}
