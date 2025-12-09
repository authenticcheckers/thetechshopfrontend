import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ message: "Method not allowed" });

  const { id, name, description, price, image_url, stock } = req.body;
  if (!id || !name || !price) return res.status(400).json({ message: "Missing required fields" });

  try {
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, image_url=$4, stock=$5 WHERE id=$6 RETURNING *`,
      [name, description, price, image_url, stock || 0, id]
    );
    res.status(200).json({ product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
}
