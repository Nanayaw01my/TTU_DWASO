const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('region', 'name code');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: `Your account has been suspended. Reason: ${user.suspendedReason || 'Contact admin'}`,
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

const requireApproved = (req, res, next) => {
  if (!req.user.isApproved) {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending admin approval. You will be notified once approved.',
    });
  }
  next();
};

module.exports = { protect, authorize, requireApproved };
