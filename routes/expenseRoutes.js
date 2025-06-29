import express from 'express';
import { getExpenseHistory } from '../controllers/expenseController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/apartment/expense
router.get('/expense', authenticateUser, getExpenseHistory);

export default router;