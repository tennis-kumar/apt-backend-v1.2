import express from 'express';
import { getFloors } from '../controllers/communityController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/floors', authenticateUser, getFloors);
export default router;