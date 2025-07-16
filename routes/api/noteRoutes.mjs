import express from 'express';
import db from '../../controllers/layanan/noteControllers.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/notes',db.getNotes)
router.get('/notes/:id', db.getNotesById)
router.post('/notes',db.createNotes)
router.put('/notes/:id', db.createNotes)
router.patch('/notes/:id', db.patchNotes)
router.delete('/notes/:id',db.deleteNotes)

export default router;