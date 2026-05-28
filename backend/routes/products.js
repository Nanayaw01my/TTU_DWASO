const express = require('express');
const router = express.Router();
const { protect, authorize, requireApproved } = require('../middleware/auth');
const { uploadProductImages } = require('../config/cloudinary');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  flagProduct,
} = require('../controllers/productController');

const optionalAuth = (req, res, next) => {
  const auth = require('../middleware/auth');
  const token = req.headers.authorization?.split(' ')[1];
  if (token) return auth.protect(req, res, next);
  next();
};

router.get('/', optionalAuth, getProducts);
router.get('/my-products', protect, authorize('vendor'), getVendorProducts);
router.get('/vendor/:vendorId', getVendorProducts);
router.get('/:id', optionalAuth, getProduct);

router.post(
  '/',
  protect,
  authorize('vendor'),
  requireApproved,
  uploadProductImages.array('images', 5),
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('vendor', 'admin'),
  uploadProductImages.array('images', 5),
  updateProduct
);

router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);
router.put('/:id/flag', protect, authorize('admin'), flagProduct);

module.exports = router;
