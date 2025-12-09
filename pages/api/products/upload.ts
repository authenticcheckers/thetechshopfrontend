import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import cloudinary from "../../../utils/cloudinary.ts"; // adjust path if needed

export const config = {
  api: {
    bodyParser: false, // required for formidable
  },
};

type Data = {
  url?: string;
  error?: string;
  details?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  try {
    form.parse(req, async (err, fields, files: any) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({
          error: "Form parse failed",
          details: err instanceof Error ? err.message : String(err),
        });
      }

      if (!files || !files.image) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "thetechshop",
          use_filename: true,
          unique_filename: true,
        });

        return res.status(200).json({ url: result.secure_url });
      } catch (uploadErr: unknown) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({
          error: "Cloudinary upload failed",
          details: uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
        });
      }
    });
  } catch (catchErr: unknown) {
    console.error("Unexpected error:", catchErr);
    return res.status(500).json({
      error: "Unexpected error",
      details: catchErr instanceof Error ? catchErr.message : String(catchErr),
    });
  }
}
