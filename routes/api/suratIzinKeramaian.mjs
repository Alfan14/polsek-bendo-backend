import express from 'express';
import db from '../../controllers/layanan/suratIzinKeramaian.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/sik',db.getSiks)
router.get('/sik/:id', db.getSikById)
router.post('/sik',db.createSik)
router.put('/sik/:id', db.updateSik)
router.patch('/sik/:id', db.patchSik)
router.delete('/sik/:id',db.deleteSik)

export default router;