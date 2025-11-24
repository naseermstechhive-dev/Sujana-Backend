import mongoose from 'mongoose';

const renewalSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      aadhar: { type: String },
      pan: { type: String },
      gender: { type: String },
      address: { type: String },
    },
    bankDetails: {
      bankName: { type: String, required: true },
      branchName: { type: String },
      loanAccountNumber: { type: String, required: true },
      loanAmount: { type: Number, required: true },
    },
    goldDetails: {
      weight: { type: Number, required: true },
      purityIndex: { type: Number, required: true },
      purityLabel: { type: String, required: true },
      ornamentType: { type: String, required: true },
      ornamentCode: { type: String, required: true },
    },
    renewalDetails: {
      renewalAmount: { type: Number, required: true }, // Amount paid to bank
      commissionAmount: { type: Number, required: true }, // Commission earned
      commissionPercentage: { type: Number, required: true },
      selectedRatePerGram: { type: Number, required: true },
    },
    renewalNo: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Renewal', renewalSchema);