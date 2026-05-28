const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

// Get all approved vendors (optionally filtered by institution)
router.get('/', async (req, res) => {
  const { institution, region } = req.query;
  const query = { role: 'vendor', isApproved: true, isSuspended: false };
  if (institution) query.institution = institution;
  if (region) query.region = region;

  const vendors = await User.find(query)
    .populate('region', 'name')
    .select('fullName businessName businessDescription phone institution institutionType passportPhoto createdAt');

  res.json({ success: true, vendors });
});

// Get a single vendor profile
router.get('/:vendorId', async (req, res) => {
  const vendor = await User.findOne({ _id: req.params.vendorId, role: 'vendor' })
    .populate('region', 'name')
    .select('-password -ghanaCardFront -ghanaCardBack');

  if (!vendor) {
    return res.status(404).json({ success: false, message: 'Vendor not found' });
  }

  res.json({ success: true, vendor });
});

module.exports = router;
