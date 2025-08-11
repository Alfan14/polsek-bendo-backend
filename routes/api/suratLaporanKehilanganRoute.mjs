import express from 'express';
import db from '../../controllers/layanan/suratLaporanKehilangan.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/slk',db.getSlks);
router.get('/slk/:id', db.getSlkById);
router.get('/slk/pdf/:id', db.downloadPdf);
router.post('/slk',db.createSlk);
router.put('/slk/:id', db.updateSlk);
router.put('/slk/status/:id', db.updateSlkVerificationStatusAdmin);
router.patch('/slk/:id', db.patchSik);
router.delete('/slk/:id',db.deleteSlk);

export default router;