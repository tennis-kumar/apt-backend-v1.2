import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    totalFloors: { type: Number, required: true },
    flatsPerFloor: { type: Number, required: true },
    waterRate: { type: Number, default: 2 },
    maintenanceRate: {type: Number, default: 2000}
}, { timestamps: true });

export default mongoose.model("Apartment", apartmentSchema);