import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cloudinary from 'cloudinary'.v2;

dotenv.config(); 

const router = express.Router()

// Configure Cloudinary (use your own cloud_name, api_key, and api_secret)
cloudinary.config({
  cloud_name: process.env.ALFAN_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ALFAN_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.ALFAN_CLOUDINARY_API_SECRET
});

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle image upload
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error uploading to Cloudinary' });
    }
    res.json({ public_id: result.public_id, url: result.secure_url });
  }).end(req.file.buffer);
});

export default router;