import express from 'express';
import { 
  generateBills, 
  getBillsByFlat,
  markBillAsPaid 
} from '../controllers/maintenanceController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', authenticateUser, generateBills);
router.get('/flat/:flatId', authenticateUser, getBillsByFlat);
router.patch('/pay/:billId', authenticateUser, markBillAsPaid);

export default router;