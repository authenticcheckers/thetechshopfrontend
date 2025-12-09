import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ordersRes = await pool.query(`
      SELECT o.*, json_agg(
        json_build_object(
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price
        )
      ) AS items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    res.status(200).json({ orders: ordersRes.rows });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
}
