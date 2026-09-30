import mongoose, { Schema } from 'mongoose';

const budgetSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    monthlyLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    period: {
      type: String,
      default: 'monthly',
    },
  },
  {
    timestamps: true,
  }
);

export const BudgetModel =
  mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
