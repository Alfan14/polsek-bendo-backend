//importing modules
import express from 'express';
import authController from '../../controllers/auth/authControllers.mjs';
import userAuth from '../../middlewares/userAuth.mjs';

const { register, login } = authController

const router = express.Router()

router.post('/signup', userAuth.saveUser, register)

//login route
router.post('/login', login )

export default router