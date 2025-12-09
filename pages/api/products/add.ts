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
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { name, description, price, stock, image_url } = req.body;
  if (!name || !price || !stock || !image_url) return res.status(400).json({ message: "Missing fields" });

  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, stock, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, description, price, stock, image_url]
    );
    res.status(200).json({ product: result.rows[0] });
  } catch (err: any) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
}
