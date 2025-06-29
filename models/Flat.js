import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true
    },
    floorNumber: { 
        type: Number,
        required: true, 
        min:1 
    },
    flatNumber: { 
        type: String, 
        required: true,
        validate:{
            validator: (v) => /^[A-Z]\d+$/.test(v),
            message: 'Flat number must be in format (e.g., "A123")'
        }
    },
    resident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isOccupied: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

flatSchema.index({
    apartment: 1,
    floorNumber: 1,
    flatNumber: 1
}, {
    unique: true
});

export default mongoose.model("Flat", flatSchema);