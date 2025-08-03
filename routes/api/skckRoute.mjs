import express from 'express';
import db from '../../controllers/layanan/skckControllers.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/skck',db.getSkcks);
router.get('/skck/:id', db.getSkckById);
router.get('/skck-status/:user_id', db.getSkckByVerificationStatus);
router.post('/skck',db.createSkck);
router.put('/skck/:id', db.updateSkck);
router.put('/skck/officer/:id', db.updateSkckOfficer);
router.patch('/skck/officer/:id', db.patchOfficerSkck);
router.delete('/skck/:id',db.deleteSkck);
router.put('/status/:id', db.updateSkckVerificationStatusAdmin);
router.get('/pdf/:id', db.downloadPdf);

export default router;