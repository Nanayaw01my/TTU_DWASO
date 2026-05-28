const User = require('../models/User');
const Region = require('../models/Region');

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      role: user.role,
      fullName: user.fullName,
      businessName: user.businessName,
      email: user.email,
      phone: user.phone,
      region: user.region,
      institution: user.institution,
      institutionType: user.institutionType,
      isApproved: user.isApproved,
      passportPhoto: user.passportPhoto,
      avatar: user.avatar,
    },
  });
};

exports.register = async (req, res) => {
  const {
    role,
    fullName,
    businessName,
    businessDescription,
    email,
    studentId,
    phone,
    password,
    regionId,
    institution,
    institutionType,
  } = req.body;

  if (!['student', 'vendor'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role. Choose student or vendor.' });
  }

  const region = await Region.findById(regionId);
  if (!region) {
    return res.status(400).json({ success: false, message: 'Invalid region selected' });
  }

  const institutionExists = region.institutions.some(
    (inst) => inst.name === institution && inst.isActive
  );
  if (!institutionExists) {
    return res.status(400).json({ success: false, message: 'Invalid institution for selected region' });
  }

  const ghanaCardFront = req.files?.ghanaCardFront?.[0]?.path || null;
  const ghanaCardBack = req.files?.ghanaCardBack?.[0]?.path || null;
  const passportPhoto = req.files?.passportPhoto?.[0]?.path || null;

  const userData = {
    role,
    fullName,
    email,
    phone,
    password,
    region: regionId,
    institution,
    institutionType,
    ghanaCardFront,
    ghanaCardBack,
    passportPhoto,
  };

  if (role === 'vendor') {
    if (!businessName) {
      return res.status(400).json({ success: false, message: 'Business name is required for vendors' });
    }
    userData.businessName = businessName;
    userData.businessDescription = businessDescription;
  }

  if (role === 'student' && studentId) {
    userData.studentId = studentId;
  }

  const user = await User.create(userData);

  const message =
    role === 'vendor'
      ? 'Vendor registration submitted. Your account is pending admin approval.'
      : 'Student registration successful. You can now log in.';

  res.status(201).json({ success: true, message });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password').populate('region', 'name code');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (user.isSuspended) {
    return res.status(403).json({
      success: false,
      message: `Account suspended. Reason: ${user.suspendedReason || 'Contact admin'}`,
    });
  }

  if (user.role === 'vendor' && !user.isApproved) {
    return res.status(403).json({
      success: false,
      message: 'Your vendor account is pending approval. Please wait for admin review.',
    });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('region', 'name code');
  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  const allowedFields = ['fullName', 'phone', 'businessDescription'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (req.files?.passportPhoto?.[0]) {
    updates.avatar = req.files.passportPhoto[0].path;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).populate('region', 'name code');

  res.json({ success: true, user });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
};
