import mongoose, { mongo } from "mongoose";

const waterUsageSchema = new mongoose.Schema(
  {
    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    unitsUsed: {
      type: Number,
      required: true,
      min: 0,
    },
    rate: {
      type: Number,
      default: 2,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

waterUsageSchema.index(
  {
    flat: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("WaterUsage", waterUsageSchema);
