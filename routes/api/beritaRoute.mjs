import express from 'express';
import db from '../../controllers/beritaControllers.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/news',db.getNews)
router.get('/news/:id', db.getNewsById)
router.post('/news',db.createNews)
router.put('/news/:id', db.updateNews)
router.patch('/news/:id', db.patchNews)
router.delete('/news/:id',db.deleteNews)

export default router;