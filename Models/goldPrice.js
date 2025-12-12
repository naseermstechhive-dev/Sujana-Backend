import mongoose from 'mongoose';

const goldPriceSchema = new mongoose.Schema(
  {
    '24K': {
      type: Number,
      required: true,
      default: 0,
    },
    '22K': {
      type: Number,
      required: true,
      default: 0,
    },
    '20K': {
      type: Number,
      required: true,
      default: 0,
    },
    '18K': {
      type: Number,
      required: true,
      default: 0,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

// Ensure only one document exists - use findOneAndUpdate with upsert
goldPriceSchema.statics.getOrCreate = async function(userId) {
  let goldPrice = await this.findOne();
  if (!goldPrice) {
    goldPrice = await this.create({
      '24K': 0,
      '22K': 0,
      '20K': 0,
      '18K': 0,
      updatedBy: userId,
    });
  }
  return goldPrice;
};

export default mongoose.model('GoldPrice', goldPriceSchema);

