import mongoose from "mongoose";

const maintenanceBillSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        required: true
    },
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    paidAt:{
        type: Date
    },
    dueDate: {
        type: Date,
        default: ()=> new Date(new Date().setDate(10)) // 10th of current month
    }
},{ timestamps: true });

maintenanceBillSchema.index({
    flat: 1,
    month: 1,
    year: 1
},{
    unique: true
});

export default mongoose.model("MaintenanceBill", maintenanceBillSchema);