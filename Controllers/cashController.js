import CashVault from '../Models/cashVault.js';

export const addCash = async (req, res, next) => {
  try {
    const { amount, type } = req.body;

    const cashEntry = await CashVault.create({
      amount,
      type: type || 'cash',
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
