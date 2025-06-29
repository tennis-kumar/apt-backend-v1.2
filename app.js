import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateUser } from "./middlewares/authMiddleware.js";
import apartmentRoutes from './routes/apartmentRoutes.js'
import flatRoutes from './routes/flatRoutes.js'
import residentRoutes from './routes/residentRoutes.js'
import waterRoutes from './routes/waterRoutes.js'
import maintenanceRoutes from './routes/maintenanceRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use( (req, res, next) => {
    if (req.method == 'POST' && !req.is('application/json')){
        return res.status(415).json({
            error: 'Content-TYpe must be application/json'
        });
    }
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/flats', flatRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Test route
app.get('/',(req,res)=>{
    res.status(200).send('🏠 Apartment Management Backend is Running!');
});

const PORT = process.env.PORT || 5000;

connectDB();


app.listen(PORT, () => {
    console.log(`🏠 Server is running on port ${PORT}`);
});
