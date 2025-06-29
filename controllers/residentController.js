import Flat from "../models/Flat.js";
import User from "../models/User.js";



export const assignResident = async (req, res) => {
    try {
        const { flatId,email } = req.body;
        console.log('Reecieved flatId:', flatId, 'Type:', typeof flatId);
        
        const flat = await Flat.findById(flatId);
        if (!flat) {
            return res.status(404).json({ error: 'Flat not found' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.flat && user.flat.toString() !== flatId){
            return res.status(400).json({ error: 'User is already assigned to another flat' });
        }

        flat.resident = user._id;
        flat.isOccupied = true;
        user.flat = flat._id;

        await Promise.all([flat.save(), user.save()]);

        res.json({
            success: true,
            flat: {
                _id: flat._id,
                flatNumber: flat.flatNumber,
                resident: {
                    email: user.email,
                    _id: user._id
                }
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'server error', message: error.message });
    }
}

export const getResidents = async (req, res) => {
    try {
        const { apartmentId } = req.params;
        const flats = await Flat.find({ apartment: apartmentId })
            .populate('resident', 'email role')
            .select('floorNumber flatNumber resident');

        res.json(flats.filter(flat => flat.resident));
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
}