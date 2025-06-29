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