import express from "express";
import cors from "cors";
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer } from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import path from "path";
import helmet from "helmet";

// route
import authRoutes from './routes/api/authRoutes.mjs';
import userRoutes from './routes/api/userRoute.mjs';
import skckRoutes from './routes/api/skckRoute.mjs';
import suratLaporanKehilanganRoutes from "./routes/api/suratLaporanKehilanganRoute.mjs";
import suratIzinKeramaianRoutes from "./routes/api/suratIzinKeramaian.mjs";
import pengaduanMasyarakatRoutes from "./routes/api/pengaduanMasyarakatRoute.mjs";
import beritaRoutes from "./routes/api/beritaRoute.mjs";
import noteRoutes from "./routes/api/noteRoutes.mjs";
import cloudinaryController from "./controllers/cloudinaryController.mjs";

import initChatHandler from "./sockets/initChatHandler.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.SERVER_PORT || 5000;
const app = express();

const allowedOrigins = [process.env.PROD_ORIGIN, process.env.ORIGIN].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS request from:', origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(helmet());

// Middleware

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.text());

// API Routes
app.use('/api/', userRoutes);
app.use('/api/', skckRoutes);
app.use('/api/', pengaduanMasyarakatRoutes);
app.use('/api/', skckRoutes);
app.use('/api/', suratIzinKeramaianRoutes);
app.use('/api/', suratLaporanKehilanganRoutes);
app.use('/api/', beritaRoutes);
app.use('/api/', noteRoutes);
app.use('/api/', cloudinaryController);


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