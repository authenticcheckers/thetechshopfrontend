import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { image } = req.body;
  if (!image) return res.status(400).json({ message: 'No image provided' });

  try {
    const uploaded = await cloudinary.uploader.upload(image, { folder: 'tech-shop-products' });
    res.status(200).json({ url: uploaded.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err });
  }
}
