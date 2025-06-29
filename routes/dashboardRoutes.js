import express from 'express';
import { getDashboardStats, getAppDashboard } from '../controllers/dashboardController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/proto', authenticateUser, getDashboardStats);
router.get('/', authenticateUser, getAppDashboard);

export default router;