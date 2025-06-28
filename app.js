import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateUser } from "./middlewares/authMiddleware.js";
import apartmentRoutes from './routes/apartmentRoutes.js'
import flatRoutes from './routes/flatRoutes.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/flats', flatRoutes);

// Test route
app.get('/',(req,res)=>{
    res.status(200).send('🏠 Apartment Management Backend is Running!');
});

const PORT = process.env.PORT || 5000;

connectDB();


app.listen(PORT, () => {
    console.log(`🏠 Server is running on port ${PORT}`);
});
