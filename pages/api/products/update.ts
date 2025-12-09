import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import cloudinary from "../../../utils/cloudinary";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files: any) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({
        error: "Form parse failed",
        details: err instanceof Error ? err.message : String(err),
      });
    }

    const { id, name, description, specs, price, stock } = fields;

    if (!id || !name || !price || !stock) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      let imageUrl: string | undefined;

      if (files?.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "thetechshop",
          use_filename: true,
          unique_filename: true,
        });
        imageUrl = result.secure_url;
      }

      // TODO: Replace this with your DB update logic
      // Example using Prisma, Supabase, or your backend API
      // await db.product.update({ ... });

      return res.status(200).json({
        message: "Product updated successfully",
        ...(imageUrl && { image_url: imageUrl }),
      });
    } catch (uploadErr: unknown) {
      console.error("Product update failed:", uploadErr);
      return res.status(500).json({
        error: "Product update failed",
        details: uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
      });
    }
  });
}
