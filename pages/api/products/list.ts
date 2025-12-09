// pages/api/products/list.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// Create the pool once
let pool: Pool;

if (!globalThis.pool) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set!");
    throw new Error("Missing DATABASE_URL environment variable");
  }
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // Store globally to avoid creating multiple pools in Vercel serverless functions
  (globalThis as any).pool = pool;
} else {
  pool = (globalThis as any).pool;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.status(200).json({ products: result.rows });
  } catch (err: any) {
    // Detailed logging for Vercel
    console.error("Database query failed:", err);
    console.error("Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({
      message: "Database query failed",
      error: err.message || "Unknown error",
    });
  }
}
