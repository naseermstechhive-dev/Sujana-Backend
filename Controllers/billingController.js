import Billing from '../Models/billing.js';

export const createBilling = async (req, res, next) => {
  try {
    const { customer, goldDetails, calculation, invoiceNo } = req.body;

    const billing = await Billing.create({
      customer,
      goldDetails,
      calculation,
      invoiceNo,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Billing created successfully',
      data: billing,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserBillings = async (req, res, next) => {
  try {
    const billings = await Billing.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'User billings retrieved successfully',
      count: billings.length,
      data: billings,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllBillings = async (req, res, next) => {
  try {
    // Only admin can see all billings
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const billings = await Billing.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'All billings retrieved successfully',
      count: billings.length,
      data: billings,
    });
  } catch (err) {
    next(err);
  }
};

export const calculateRenewal = async (req, res, next) => {
  try {
    const { percentage, amount } = req.body;

    if (!percentage || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Percentage and amount are required',
      });
    }

    const commissionAmount = (percentage / 100) * amount;

    res.json({
      success: true,
      message: 'Commission calculated successfully',
      commissionAmount,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBilling = async (req, res, next) => {
  try {
    // Only admin can delete billings
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const { id } = req.params;

    const billing = await Billing.findById(id);
    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing not found',
      });
    }

    await Billing.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Billing deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};