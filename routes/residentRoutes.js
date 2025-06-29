import express from "express";
import { assignResident, getResidents } from "../controllers/residentController.js";
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/assign', authenticateUser, assignResident);
router.get('/:apartmentId',authenticateUser, getResidents);

export default router;