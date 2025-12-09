import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

declare global {
  var pool: Pool | undefined;
}

let pool: Pool;

if (!globalThis.pool) {
  if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  globalThis.pool = pool;
} else {
  pool = globalThis.pool;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Database query failed", error: err.message });
  }
}
