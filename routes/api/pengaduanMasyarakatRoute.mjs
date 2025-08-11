import express from 'express';
import db from '../../controllers/layanan/pengaduanMasyarakat.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/pm',db.getReports);
router.get('/pm/:id', db.getReportById);
router.get('/pm/pdf/:id', db.downloadPdf);
router.post('/pm',db.createReport);
router.put('/pm/:id', db.updateReport);
router.put('/pm/status/:id', db.updatePmVerificationStatusAdmin);
router.patch('/pm/:id', db.patchReport);
router.delete('/pm/:id',db.deleteReport);

export default router;