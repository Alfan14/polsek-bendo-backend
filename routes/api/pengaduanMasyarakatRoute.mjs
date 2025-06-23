import express from 'express';
import db from '../../controllers/layanan/pengaduanMasyarakat.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/reports',db.getReports)
router.get('/reports/:id', db.getReportById)
router.post('/reports',db.createReport)
router.put('/reports/:id', db.updateReport)
router.delete('/reports/:id',db.deleteReport)

export default router;