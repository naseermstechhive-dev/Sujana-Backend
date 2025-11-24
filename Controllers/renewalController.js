import Renewal from '../Models/renewal.js';
import CashVault from '../Models/cashVault.js';

export const createRenewal = async (req, res, next) => {
  try {
    const { customer, bankDetails, goldDetails, renewalDetails, renewalNo } = req.body;

    const renewal = await Renewal.create({
      customer,
      bankDetails,
      goldDetails,
      renewalDetails,
      renewalNo,
      createdBy: req.user._id,
    });

    // Deduct renewal amount from cash vault
    await CashVault.create({
      amount: renewalDetails.renewalAmount,
      type: 'billing', // Using billing type for cash outflow
      addedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Renewal created successfully',
      data: renewal,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserRenewals = async (req, res, next) => {
  try {
    const renewals = await Renewal.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'User renewals retrieved successfully',
      count: renewals.length,
      data: renewals,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllRenewals = async (req, res, next) => {
  try {
    // Only admin can see all renewals
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const renewals = await Renewal.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'All renewals retrieved successfully',
      count: renewals.length,
      data: renewals,
    });
  } catch (err) {
    next(err);
  }
};

export const calculateRenewalCommission = async (req, res, next) => {
  try {
    const { loanAmount, commissionPercentage } = req.body;

    if (!loanAmount || !commissionPercentage) {
      return res.status(400).json({
        success: false,
        message: 'Loan amount and commission percentage are required',
      });
    }

    const commissionAmount = (commissionPercentage / 100) * loanAmount;

    res.json({
      success: true,
      message: 'Commission calculated successfully',
      commissionAmount,
      renewalAmount: loanAmount,
    });
  } catch (err) {
    next(err);
  }
};