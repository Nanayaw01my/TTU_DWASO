const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadProductImages } = require('../config/cloudinary');

router.post('/product-images', protect, uploadProductImages.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No images uploaded' });
  }
  const urls = req.files.map((f) => f.path);
  res.json({ success: true, urls });
});

module.exports = router;
