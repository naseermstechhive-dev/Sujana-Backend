import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      aadhar: { type: String },
      pan: { type: String },
      gender: { type: String },
      address: { type: String },
    },
    goldDetails: {
      weight: { type: Number, required: true },
      stoneWeight: { type: Number, default: 0 },
      purityIndex: { type: Number, required: true },
      purityLabel: { type: String, required: true },
      ornamentType: { type: String, required: true },
      ornamentCode: { type: String, required: true },
    },
    calculation: {
      selectedRatePerGram: { type: Number, required: true },
      grams: { type: Number, required: true },
      stone: { type: Number, default: 0 },
      net: { type: Number, required: true },
      finalPayout: { type: Number, required: true },
    },
    invoiceNo: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerPhoto: {
      type: String, // Base64 encoded image data
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Billing', billingSchema);