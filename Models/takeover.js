import mongoose from 'mongoose';

const takeoverSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      aadhar: { type: String },
      pan: { type: String },
      gender: { type: String },
      address: { type: String },
    },
    pledgeDetails: {
      originalPledgeAmount: { type: Number, required: true },
      pledgeDate: { type: Date, required: true },
      pledgedTo: { type: String, required: true }, // Bank or other party
      loanAccountNumber: { type: String },
    },
    goldDetails: {
      weight: { type: Number, required: true },
      purityIndex: { type: Number, required: true },
      purityLabel: { type: String, required: true },
      ornamentType: { type: String, required: true },
      ornamentCode: { type: String, required: true },
    },
    takeoverDetails: {
      takeoverAmount: { type: Number, required: true }, // Amount paid to take over
      selectedRatePerGram: { type: Number, required: true },
      estimatedValue: { type: Number, required: true },
      profitLoss: { type: Number }, // takeoverAmount - estimatedValue
    },
    takeoverNo: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Takeover', takeoverSchema);