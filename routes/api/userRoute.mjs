import express from 'express';
import db from '../../controllers/auth/usersControllers.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';
import multer from 'multer';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

const generalFormParser = multer();

router.get('/users', db.getUsers)
router.get('/users/:id', authenticate, authorize(['admin','konselor','pelajar']),db.getUserById)
router.post('/users',db.createUser)
router.put('/users/:id', authenticate, authorize(['admin']),db.updateUser)
router.patch('/users/:id', authenticate, authorize(['admin']),db.updateUse)
router.delete('/users/:id', authenticate, authorize(['admin']),db.deleteUser)

export default router;