import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateUser, getDashboardStats);

export default router;