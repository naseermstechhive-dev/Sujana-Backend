import GoldPrice from '../Models/goldPrice.js';

export const getGoldPrices = async (req, res, next) => {
  try {
    let goldPrice = await GoldPrice.findOne().sort({ updatedAt: -1 });
    
    // If no gold price exists, return default values (don't create in public endpoint)
    if (!goldPrice) {
      return res.json({
        success: true,
        data: {
          '24K': 0,
          '22K': 0,
          '20K': 0,
          '18K': 0,
        },
      });
    }

    res.json({
      success: true,
      data: {
        '24K': goldPrice['24K'],
        '22K': goldPrice['22K'],
        '20K': goldPrice['20K'],
        '18K': goldPrice['18K'],
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateGoldPrices = async (req, res, next) => {
  try {
    // Only admin can update gold prices
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const { '24K': price24K, '22K': price22K, '20K': price20K, '18K': price18K } = req.body;

    // Find existing gold price or create new one
    let goldPrice = await GoldPrice.findOne().sort({ updatedAt: -1 });
    
    if (goldPrice) {
      // Update existing
      goldPrice['24K'] = price24K !== undefined ? price24K : goldPrice['24K'];
      goldPrice['22K'] = price22K !== undefined ? price22K : goldPrice['22K'];
      goldPrice['20K'] = price20K !== undefined ? price20K : goldPrice['20K'];
      goldPrice['18K'] = price18K !== undefined ? price18K : goldPrice['18K'];
      goldPrice.updatedBy = req.user._id;
      await goldPrice.save();
    } else {
      // Create new
      goldPrice = await GoldPrice.create({
        '24K': price24K || 0,
        '22K': price22K || 0,
        '20K': price20K || 0,
        '18K': price18K || 0,
        updatedBy: req.user._id,
      });
    }

    res.json({
      success: true,
      message: 'Gold prices updated successfully',
      data: {
        '24K': goldPrice['24K'],
        '22K': goldPrice['22K'],
        '20K': goldPrice['20K'],
        '18K': goldPrice['18K'],
      },
    });
  } catch (err) {
    next(err);
  }
};

