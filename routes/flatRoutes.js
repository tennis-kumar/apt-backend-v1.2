import express from "express";
import { createFlat, getFlatsByApartment } from "../controllers/flatController.js";
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router();

//Admin only
router.post('/', authenticateUser, createFlat);
router.get('/:apartmentId', getFlatsByApartment);

export default router;