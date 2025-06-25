import express from "express";
import cors from "cors";
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer } from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import path from "path";

// route
import authRoutes from './routes/api/authRoutes.mjs';
import userRoutes from './routes/api/userRoute.mjs';
import skckRoutes from './routes/api/skckRoute.mjs';
import suratLaporanKehilanganRoutes from "./routes/api/suratLaporanKehilanganRoute.mjs";
import suratIzinKeramaianRoutes from "./routes/api/suratIzinKeramaian.mjs";
import pengaduanMasyarakatRoutes from "./routes/api/pengaduanMasyarakatRoute.mjs";
import beritaRoutes from "./routes/api/beritaRoute.mjs";
import cloudinary from "./controllers/cloudinaryController.mjs"

import initChatHandler from "./sockets/initChatHandler.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const upload = multer();
const PORT = process.env.SERVER_PORT || 5000;
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true                
}));

// const allowedOrigins = [process.env.ORIGIN, process.env.PROD_ORIGIN];

// const corsOptions = {
//   origin: [process.env.ORIGIN, process.env.PROD_ORIGIN],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'session-id'],
//   credentials: true,
// };

//console.log('Allowed origins:', allowedOrigins);

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   path: "/socket.io",
//   cors: {
//     origin: [process.env.ORIGIN, process.env.PROD_ORIGIN],
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });
// console.log("Initializing chat handler...");
// initChatHandler(io);

// Middleware
app.use(express.json());
app.use(upload.array());

// API Routes
app.use('/api/', userRoutes);
app.use('/api/', skckRoutes);
app.use('/api/', pengaduanMasyarakatRoutes);
app.use('/api/', skckRoutes);
app.use('/api/', suratIzinKeramaianRoutes);
app.use('/api/', suratLaporanKehilanganRoutes);
app.use('/api/', beritaRoutes);
app.use('/api/',cloudinary);


// Auth Routes
app.use('/auth/', authRoutes);

app.get("/", (req, res) => {
  console.log("Halo kamu sampai default Route");
  res.send("This is the default Server Route");
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});