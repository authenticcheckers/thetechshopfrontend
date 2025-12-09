import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import cloudinary from "../../../utils/cloudinary";

export const config = { api: { bodyParser: false } };

type Data = { url?: string; error?: string; details?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // NEW way for Formidable v3+
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files: any) => {
      if (err) return res.status(500).json({ error: "Form parse failed", details: String(err) });

      const file = files?.image ? (Array.isArray(files.image) ? files.image[0] : files.image) : null;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "thetechshop",
          use_filename: true,
          unique_filename: true,
        });

        return res.status(200).json({ url: result.secure_url });
      } catch (cloudErr: unknown) {
        return res.status(500).json({
          error: "Cloudinary upload failed",
          details: cloudErr instanceof Error ? cloudErr.message : String(cloudErr),
        });
      }
    });
  } catch (outerErr: unknown) {
    return res.status(500).json({
      error: "Unexpected server error",
      details: outerErr instanceof Error ? outerErr.message : String(outerErr),
    });
  }
}
