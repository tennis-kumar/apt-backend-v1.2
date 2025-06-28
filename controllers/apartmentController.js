import Apartment from '../models/Apartment.js';

export const createApartment = async (req,res) => {
    try {
        const apartment = new Apartment(req.body);
        await apartment.save();
        res.status(201).json(apartment);
    } catch (error) {
        res.status(400).json({ error: error.message, details: error.errors });
    }
};

export const getAllApartments = async(req, res) => {
    try {
        const apartments = await Apartment.find().select('-__v');
        res.json(apartments);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};