import Takeover from '../Models/takeover.js';
import CashVault from '../Models/cashVault.js';

export const createTakeover = async (req, res, next) => {
  try {
    const { customer, pledgeDetails, goldDetails, takeoverDetails, takeoverNo } = req.body;

    // Calculate profit/loss
    const profitLoss = takeoverDetails.takeoverAmount - takeoverDetails.estimatedValue;

    const takeover = await Takeover.create({
      customer,
      pledgeDetails,
      goldDetails,
      takeoverDetails: {
        ...takeoverDetails,
        profitLoss,
      },
      takeoverNo,
      createdBy: req.user._id,
    });

    // Deduct takeover amount from cash vault
    await CashVault.create({
      amount: takeoverDetails.takeoverAmount,
      type: 'billing', // Using billing type for cash outflow
      addedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Takeover created successfully',
      data: takeover,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserTakeovers = async (req, res, next) => {
  try {
    const takeovers = await Takeover.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'User takeovers retrieved successfully',
      count: takeovers.length,
      data: takeovers,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllTakeovers = async (req, res, next) => {
  try {
    // Only admin can see all takeovers
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const takeovers = await Takeover.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'All takeovers retrieved successfully',
      count: takeovers.length,
      data: takeovers,
    });
  } catch (err) {
    next(err);
  }
};

export const calculateTakeoverValue = async (req, res, next) => {
  try {
    const { weight, selectedRatePerGram } = req.body;

    if (!weight || !selectedRatePerGram) {
      return res.status(400).json({
        success: false,
        message: 'Weight and rate per gram are required',
      });
    }

    const estimatedValue = weight * selectedRatePerGram;

    res.json({
      success: true,
      message: 'Takeover value calculated successfully',
      estimatedValue,
    });
  } catch (err) {
    next(err);
  }
};