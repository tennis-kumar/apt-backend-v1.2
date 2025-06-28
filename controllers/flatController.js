import Flat from '../models/Flat.js';
import Apartment from '../models/Apartment.js';

export const createFlat = async (req, res) => {
    try {
        const { apartmentId, floorNumber, flatNumber } = req.body;
        const apartment = await Apartment.findById(apartmentId);
        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        if( floorNumber > apartment.totalFloors ){
            return res.status(400).json({ error: 'Invalid floor number' });
        }

        const flat = new Flat({
            apartment:apartmentId,
            floorNumber,
            flatNumber
        });

        await flat.save();
        res.status(201).json(flat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getFlatsByApartment = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const flats = await Flat.find({ apartment: apartmentId })
      .sort({ floorNumber: 1, flatNumber: 1 })
      .populate('resident', 'email');

    // Group by floor
    const floors = {};
    flats.forEach(flat => {
      if (!floors[flat.floorNumber]) {
        floors[flat.floorNumber] = [];
      }
      floors[flat.floorNumber].push(flat);
    });

    res.json({ floors });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};