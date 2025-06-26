//importing modules
import express from 'express';
import authController from '../../controllers/auth/authControllers.mjs';
import userAuth from '../../middlewares/userAuth.mjs';
import multer from 'multer';

const { register, login } = authController

const router = express.Router()

const generalFormParser = multer();

router.post('/signup', userAuth.saveUser, register)

router.post('/login', login )

export default router