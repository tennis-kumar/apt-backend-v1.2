import express from 'express';
import { initiateLogin, verifyOTP } from '../controllers/authControllers.js';

const router = express.Router();
router.post('/login', initiateLogin);
router.post('/verify', verifyOTP);
export default router;