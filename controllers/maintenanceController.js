import MaintenanceBill from '../models/MaintenanceBill.js';
import Flat from '../models/Flat.js';
import Apartment from '../models/Apartment.js';

// Generate bills for all flats in an apartment
export const generateBills = async (req, res) => {
  try {
    const { apartmentId, month, year } = req.body;

    // Validate apartment
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Get all flats
    const flats = await Flat.find({ apartment: apartmentId });

    // Generate bills
    const bills = await Promise.all(
      flats.map(async (flat) => {
        const existingBill = await MaintenanceBill.findOne({
          flat: flat._id,
          month,
          year
        });

        if (existingBill) {
          return existingBill;
        }

        return MaintenanceBill.create({
          flat: flat._id,
          apartment: apartmentId,
          month,
          year,
          amount: apartment.maintenanceRate
        });
      })
    );

    res.json({
      success: true,
      billsGenerated: bills.filter(bill => !bill._id).length,
      totalBills: bills.length
    });

  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Bills already generated for this period' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Get bills for a flat
export const getBillsByFlat = async (req, res) => {
  try {
    const { flatId } = req.params;
    const bills = await MaintenanceBill.find({ flat: flatId })
      .sort({ year: -1, month: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a bill as paid
export const markBillAsPaid = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await MaintenanceBill.findByIdAndUpdate(
      billId,
      { 
        paid: true,
        paidAt: new Date() 
      },
      { new: true } // Return the updated document
    );

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({
      success: true,
      bill: {
        _id: bill._id,
        flat: bill.flat,
        amount: bill.amount,
        paid: bill.paid,
        paidAt: bill.paidAt
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};