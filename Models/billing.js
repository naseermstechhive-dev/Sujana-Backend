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
      ornamentCode: { type: String, required: false }, // Deprecated - kept for backward compatibility with deployed backend
      kdmType: { 
        type: String, 
        required: false, // Made optional temporarily for backward compatibility
        enum: ['KDM', 'Non KDM'],
        default: 'KDM'
      },
    },
    calculation: {
      selectedRatePerGram: { type: Number, required: true },
      grams: { type: Number, required: true },
      stone: { type: Number, default: 0 },
      net: { type: Number, required: true },
      finalPayout: { type: Number, required: true },
      editedAmount: { type: Number, default: null }, // Editable amount after calculation
    },
    invoiceNo: { type: String, required: true, unique: true },
    billingType: {
      type: String,
      enum: ['Physical', 'Release', 'TakeOver'],
      default: 'Physical'
    },
    bankName: { type: String },
    commissionPercentage: { type: Number },
    commissionAmount: { type: Number },
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