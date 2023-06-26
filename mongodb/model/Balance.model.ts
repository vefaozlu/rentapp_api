import mongoose from "mongoose";

const Schema = mongoose.Schema;

const balanceSchema = new Schema(
  {
    balance: { type: Number, required: true, default: 0 },
    payPeriod: { type: Number, required: true, default: 0 },
    currentPeriodEndDate: { type: Date, required: false },
    rentAmount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: false,
  }
);

const Balance = mongoose.model("Balance", balanceSchema);

export { Balance };
