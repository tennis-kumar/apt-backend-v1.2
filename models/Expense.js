import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['security', 'utilities', 'gardening', 'maintenance', 'generator', 'water', 'electricity'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String
});

export default mongoose.model('Expense', expenseSchema);