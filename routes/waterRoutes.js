import express from "express";
import { recordUsage, getWaterHistory } from "../controllers/waterController.js";
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/',authenticateUser, recordUsage)
router.get('/flat/:flatId', authenticateUser, getWaterHistory);

export default router;