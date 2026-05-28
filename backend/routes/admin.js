const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getPendingVendors,
  approveVendor,
  rejectVendor,
  suspendUser,
  unsuspendUser,
  getAllUsers,
  deleteUser,
  getFlaggedProducts,
  unflagProduct,
  deleteProduct,
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/vendors/pending', getPendingVendors);
router.put('/vendors/approve/:vendorId', approveVendor);
router.put('/vendors/reject/:vendorId', rejectVendor);
router.put('/users/suspend/:userId', suspendUser);
router.put('/users/unsuspend/:userId', unsuspendUser);
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);
router.get('/products/flagged', getFlaggedProducts);
router.put('/products/unflag/:productId', unflagProduct);
router.delete('/products/:productId', deleteProduct);

module.exports = router;
