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

module.exports = router;
