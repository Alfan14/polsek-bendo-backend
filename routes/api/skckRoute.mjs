import express from 'express';
import db from '../../controllers/layanan/skckControllers.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/skck',db.getSkcks)
router.get('/skck/:id', db.getSkckById)
router.post('/skck',db.createSkck)
router.put('/skck/:id', db.updateSkck)
router.put('/skck/officer/:id', db.updateSkckOfficer)
router.delete('/skck/:id',db.deleteSkck)

export default router;