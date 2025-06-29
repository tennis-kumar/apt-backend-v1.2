import WaterUsage from "../models/WaterUsage.js";
import Flat from "../models/Flat.js";

export const recordUsage = async(req, res)=>{
    try {
        const { flatId, month, year, unitsUsed } = req.body;

        const flat = await Flat.findById(flatId);
        if (!flat) {
            return res.status(404).json({ error: 'Flat not found' });
        }

        const rate = flat.apartment.waterRate || 2;
        const amount = unitsUsed * rate;

        const usage = new WaterUsage({
            flat: flatId,
            month,
            year,
            unitsUsed,
            rate,
            amount
        });
        await usage.save();
        res.status(201).json(usage);
    } catch (error) {
        if (error.code === 11000){
            res.status(400).json({ error: 'Water reading already exists for this mmonth' });
        } else {
            res.status(500).json({ error: 'Server error', message: error.message });
        }
    }
}

// export const getWaterHistory = async (req, res) => {
//   try {
//     const { flatId } = req.params;
//     const history = await WaterUsage.find({ flat: flatId })
//       .sort({ year: -1, month: -1 });

//     res.json(history);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const getWaterHistory = async (req, res) => {
  try {
    const user = req.user;
    const readings = await WaterUsage.find({ 
      flat: user.flat 
    }).sort({ year: -1, month: -1 });

    let prevReading = 0;
    const history = readings.map(reading => {
      const record = {
        month: monthNames[reading.month - 1],
        oldReading: prevReading,
        newReading: reading.unitsUsed,
        amount: reading.amount,
        amountPaid: false // Need payment integration
      };
      prevReading = reading.unitsUsed;
      return record;
    });

    res.json({
      status: 'success',
      data: history
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};