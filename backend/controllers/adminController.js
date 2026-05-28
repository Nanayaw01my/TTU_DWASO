const User = require('../models/User');
const Product = require('../models/Product');
const Region = require('../models/Region');

exports.getDashboardStats = async (req, res) => {
  const [
    totalStudents,
    totalVendors,
    pendingVendors,
    totalProducts,
    flaggedProducts,
    approvedVendors,
    suspendedUsers,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'vendor' }),
    User.countDocuments({ role: 'vendor', isApproved: false, isSuspended: false }),
    Product.countDocuments({ isFlagged: false }),
    Product.countDocuments({ isFlagged: true }),
    User.countDocuments({ role: 'vendor', isApproved: true }),
    User.countDocuments({ isSuspended: true }),
  ]);

  const recentVendors = await User.find({ role: 'vendor' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('region', 'name')
    .select('fullName businessName email institution isApproved createdAt');

  const recentProducts = await Product.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('vendorId', 'fullName businessName')
    .populate('region', 'name');

  res.json({
    success: true,
    stats: {
      totalStudents,
      totalVendors,
      pendingVendors,
      approvedVendors,
      totalProducts,
      flaggedProducts,
      suspendedUsers,
    },
    recentVendors,
    recentProducts,
  });
};

exports.getPendingVendors = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [vendors, total] = await Promise.all([
    User.find({ role: 'vendor', isApproved: false, isSuspended: false })
      .populate('region', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments({ role: 'vendor', isApproved: false, isSuspended: false }),
  ]);

  res.json({
    success: true,
    vendors,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
};

exports.approveVendor = async (req, res) => {
  const vendor = await User.findOneAndUpdate(
    { _id: req.params.vendorId, role: 'vendor' },
    { isApproved: true, approvedAt: new Date(), approvedBy: req.user._id, rejectedReason: null },
    { new: true }
  ).populate('region', 'name');

  if (!vendor) {
    return res.status(404).json({ success: false, message: 'Vendor not found' });
  }

  res.json({ success: true, message: `Vendor ${vendor.businessName} approved successfully`, vendor });
};

exports.rejectVendor = async (req, res) => {
  const { reason } = req.body;

  const vendor = await User.findOneAndUpdate(
    { _id: req.params.vendorId, role: 'vendor' },
    { isApproved: false, rejectedReason: reason },
    { new: true }
  );

  if (!vendor) {
    return res.status(404).json({ success: false, message: 'Vendor not found' });
  }

  res.json({ success: true, message: 'Vendor rejected', vendor });
};

exports.suspendUser = async (req, res) => {
  const { reason } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { isSuspended: true, suspendedReason: reason },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, message: `User ${user.fullName} suspended`, user });
};

exports.unsuspendUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { isSuspended: false, suspendedReason: null },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, message: `User ${user.fullName} unsuspended`, user });
};

exports.getAllUsers = async (req, res) => {
  const { role, page = 1, limit = 20, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { businessName: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .populate('region', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-password'),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    users,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  if (user.role === 'admin') {
    return res.status(403).json({ success: false, message: 'Cannot delete admin accounts' });
  }

  if (user.role === 'vendor') {
    await Product.deleteMany({ vendorId: user._id });
  }

  await user.deleteOne();
  res.json({ success: true, message: 'User deleted successfully' });
};

exports.getFlaggedProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find({ isFlagged: true })
      .populate('vendorId', 'fullName businessName')
      .populate('region', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments({ isFlagged: true }),
  ]);

  res.json({
    success: true,
    products,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
};

exports.unflagProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { isFlagged: false, flagReason: null },
    { new: true }
  );
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, message: 'Product unflagged', product });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
};
