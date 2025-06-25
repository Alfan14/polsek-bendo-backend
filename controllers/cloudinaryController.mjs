import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config(); 

const router = express.Router()

cloudinary.config({
  cloud_name: "dcnpu9qlr",
  api_key: "671138926981391",
  api_secret: "xYDw8K4vmB8JgWuoQ59X0Bgyjn0"
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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