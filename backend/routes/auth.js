const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadVerificationDocs } = require('../config/cloudinary');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const uploadFields = uploadVerificationDocs.fields([
  { name: 'ghanaCardFront', maxCount: 1 },
  { name: 'ghanaCardBack', maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
]);

router.post('/register', uploadFields, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadFields, updateProfile);
router.put('/change-password', protect, changePassword);

router.put('/update-location', protect, async (req, res) => {
  try {
    const { region, institution, institutionType } = req.body;
    const User = require('../models/User');
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { region, institution, institutionType },
      { new: true }
    ).populate('region', 'name code');
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
