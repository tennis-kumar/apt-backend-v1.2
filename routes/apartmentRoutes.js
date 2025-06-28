import express from "express";
import { createApartment, getAllApartments } from "../controllers/apartmentController.js";
import { authenticateUser } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/',authenticateUser, createApartment);
router.get('/', getAllApartments);

export default router;