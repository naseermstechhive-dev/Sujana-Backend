import CashVault from '../Models/cashVault.js';

export const addCash = async (req, res, next) => {
  try {
    const { amount, type } = req.body;

    const cashEntry = await CashVault.create({
      amount,
      type: type || 'initial',
      addedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Cash entry added successfully',
      data: cashEntry,
    });
  } catch (err) {
    next(err);
  }
};

export const getCashVault = async (req, res, next) => {
  try {
    let query = {};

    // If user is NOT admin, only show their own entries
    if (req.user.role !== 'admin') {
      query = { addedBy: req.user._id };
    }

    const cashEntries = await CashVault.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Cash vault entries retrieved successfully',
      count: cashEntries.length,
      data: cashEntries,
    });
  } catch (err) {
    next(err);
  }
};

export const addRemainingCash = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const cashEntry = await CashVault.create({
      amount,
      type: 'remaining',
      addedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Remaining cash entry added successfully',
      data: cashEntry,
    });
  } catch (err) {
    next(err);
  }
};

export const addBillingDeduction = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const cashEntry = await CashVault.create({
      amount,
      type: 'billing',
      addedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Billing deduction added successfully',
      data: cashEntry,
    });
  } catch (err) {
    next(err);
  }
};

export const resetInitialCash = async (req, res, next) => {
  try {
    // Only admin can reset initial cash
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    await CashVault.deleteMany({ type: 'initial' });

    res.json({
      success: true,
      message: 'Initial cash reset successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getMargin = async (req, res, next) => {
  try {
    const initialCash = await CashVault.aggregate([
      { $match: { type: 'initial' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalBillings = await CashVault.aggregate([
      { $match: { type: 'billing' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const initialAmount = initialCash.length > 0 ? initialCash[0].total : 0;
    const billingAmount = totalBillings.length > 0 ? totalBillings[0].total : 0;
    const margin = initialAmount - billingAmount;

    res.json({
      success: true,
      data: {
        initialCash: initialAmount,
        totalBillings: billingAmount,
        margin: margin,
        remainingCash: margin
      }
    });
  } catch (err) {
    next(err);
  }
};

export const checkInitialCashExists = async (req, res, next) => {
  try {
    const initialCashCount = await CashVault.countDocuments({ type: 'initial' });

    res.json({
      success: true,
      hasInitialCash: initialCashCount > 0
    });
  } catch (err) {
    next(err);
  }
};
