import Billing from '../Models/billing.js';
import CashVault from '../Models/cashVault.js';
import Renewal from '../Models/renewal.js';
import Takeover from '../Models/takeover.js';

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

    // Automatically deduct the billing amount from cash vault
    await CashVault.create({
      amount: calculation.finalPayout,
      type: 'billing',
      addedBy: req.user._id,
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

export const resetGoldTransactions = async (req, res, next) => {
  try {
    // Only admin can reset gold transactions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    // Delete all gold-related transactions
    await Billing.deleteMany({});
    await Renewal.deleteMany({});
    await Takeover.deleteMany({});
    await CashVault.deleteMany({ type: { $in: ['billing'] } });

    res.json({
      success: true,
      message: 'All gold transactions reset successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getDailyTransactions = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all transactions for today
    const billings = await Billing.find({
      createdAt: { $gte: today, $lt: tomorrow }
    }).populate('createdBy', 'name');

    const renewals = await Renewal.find({
      createdAt: { $gte: today, $lt: tomorrow }
    }).populate('createdBy', 'name');

    const takeovers = await Takeover.find({
      createdAt: { $gte: today, $lt: tomorrow }
    }).populate('createdBy', 'name');

    const cashEntries = await CashVault.find({
      createdAt: { $gte: today, $lt: tomorrow }
    }).populate('addedBy', 'name');

    // Calculate daily totals
    const totalBillings = billings.reduce((sum, b) => sum + (b.calculation?.finalPayout || 0), 0);
    const totalRenewals = renewals.reduce((sum, r) => sum + (r.renewalDetails?.renewalAmount || 0), 0);
    const totalTakeovers = takeovers.reduce((sum, t) => sum + (t.takeoverDetails?.takeoverAmount || 0), 0);
    const totalCashIn = cashEntries.filter(c => c.type === 'initial').reduce((sum, c) => sum + c.amount, 0);
    const totalCashOut = cashEntries.filter(c => c.type === 'billing').reduce((sum, c) => sum + c.amount, 0);

    res.json({
      success: true,
      data: {
        date: today.toISOString().split('T')[0],
        transactions: {
          billings,
          renewals,
          takeovers,
          cashEntries
        },
        summary: {
          totalBillings,
          totalRenewals,
          totalTakeovers,
          totalCashIn,
          totalCashOut,
          netCashFlow: totalCashIn - totalCashOut
        }
      }
    });
  } catch (err) {
    next(err);
  }
};