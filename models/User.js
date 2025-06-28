import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { code: String, expiresAt: Date },
    isVerified: { type: String, default: false },
    role: { type: String, enum: ['admin','resident'], default: 'resident' },
    flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat' },
    createdAt: { type: Date, default: Date.now },
});

userSchema.methods.generateOTP = function(){
    this.otp = {
        code: uuidv4().slice(0, 6), // Generate a 6-character OTP
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes
    };
    return this.otp.code;
};

export default mongoose.model("User", userSchema);