import express from 'express';
import db from '../../controllers/layanan/suratLaporanKehilangan.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/slk',db.getSlks)
router.get('/slk/:id', db.getSlkById)
router.post('/slk',db.createSlk)
router.put('/slk/:id', db.updateSlk)
router.delete('/slk/:id',db.deleteSlk)

export default router;