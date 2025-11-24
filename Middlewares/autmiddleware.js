import jwt from 'jsonwebtoken';
import User from '../Models/user.js';

export const authenticateToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  res.status(401).json({ success: false, message: 'No token provided' });
};
