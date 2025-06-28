import express from 'express';
import { initiateLogin } from '../controllers/authControllers.js';

const router = express.Router();
router.post('/login', initiateLogin);

export default router;