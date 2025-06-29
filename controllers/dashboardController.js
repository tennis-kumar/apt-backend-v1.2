import WaterUsage from '../models/WaterUsage.js';
import MaintenanceBill from '../models/MaintenanceBill.js';
import Apartment from '../models/Apartment.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req, res) => {
  try {
    const { apartmentId, month, year } = req.query;

    // Validate apartment
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Get water usage stats
    const waterUsage = await WaterUsage.aggregate([
      {
        $match: { 
          apartment: new mongoose.Types.ObjectId(apartmentId),
          month: parseInt(month),
          year: parseInt(year)
        }
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$unitsUsed" },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    // Get maintenance stats
    const maintenanceStats = await MaintenanceBill.aggregate([
      {
        $match: { 
          apartment: new mongoose.Types.ObjectId(apartmentId),
          month: parseInt(month),
          year: parseInt(year)
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalPaid: { 
            $sum: { 
              $cond: [{ $eq: ["$paid", true] }, "$amount", 0] 
            } 
          }
        }
      }
    ]);

    res.json({
      month,
      year,
      apartment: apartment.name,
      waterUsage: waterUsage[0] || { totalUnits: 0, totalAmount: 0 },
      maintenance: maintenanceStats[0] || { totalAmount: 0, totalPaid: 0 }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export const getAppDashboard = async (req, res) => {
  try {
    const user = req.user; // From auth middleware
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Get flat details
    const flat = await Flat.findById(user.flat)
      .populate('apartment')
      .populate('resident');

    // 2. Get water readings
    const waterReadings = await WaterUsage.find({ 
      flat: user.flat,
      year: currentYear,
      $or: [
        { month: currentMonth }, // Current month
        { month: currentMonth - 1 } // Last month
      ]
    }).sort({ month: 1 });

    // 3. Get maintenance status
    const maintenance = await MaintenanceBill.findOne({
      flat: user.flat,
      month: currentMonth,
      year: currentYear
    });

    // 4. Format response
    const lastMonthReading = waterReadings[0]?.unitsUsed || 0;
    const currentMonthReading = waterReadings[1]?.unitsUsed || 0;

    res.json({
      status: 'success',
      data: {
        month: monthNames[currentMonth],
        lastMonthReading,
        currentMonthReading,
        consumedLiters: currentMonthReading - lastMonthReading,
        justWaterBill: waterReadings[1]?.amount || 0,
        apartmentOverallExpense: 57000, // Will implement later
        flatOwnerName: flat.resident?.name || 'Not assigned'
      }
    });

  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
};