// pages/api/products/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import cloudinary from "../../../utils/cloudinary";

export const config = {
  api: { bodyParser: false }, // required for file uploads
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files: any) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Form parse failed", details: err });
    }

    if (!files.image) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      // Cloudinary upload
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "thetechshop",
        use_filename: true,
        unique_filename: true,
      });

      return res.status(200).json({ url: result.secure_url });
    } catch (uploadErr) {
      console.error("Cloudinary upload failed:", uploadErr);
      return res.status(500).json({ error: "Cloudinary upload failed", details: uploadErr });
    }
  });
}
