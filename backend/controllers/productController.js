const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { title, description, price, category, condition, negotiable } = req.body;

  console.log('[createProduct] files received:', req.files?.length ?? 0, req.files?.map(f => f.path));
  const images = (req.files || []).filter((f) => f.path).map((f) => f.path);

  const product = await Product.create({
    title,
    description,
    price: Number(price),
    category,
    condition,
    negotiable: negotiable === 'true',
    images,
    vendorId: req.user._id,
    institution: req.user.institution,
    institutionType: req.user.institutionType,
    region: req.user.region._id,
  });

  const populated = await product.populate('vendorId', 'fullName businessName phone passportPhoto');

  res.status(201).json({ success: true, product: populated });
};

exports.getProducts = async (req, res) => {
  const {
    institution,
    category,
    search,
    minPrice,
    maxPrice,
    condition,
    page = 1,
    limit = 12,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const query = { isAvailable: true, isFlagged: false };

  if (institution) query.institution = institution;
  if (category) query.category = category;
  if (condition) query.condition = condition;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    query.$text = { $search: search };
  }

  // Students only see their own institution's products
  if (req.user && req.user.role === 'student') {
    query.institution = req.user.institution;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('vendorId', 'fullName businessName phone passportPhoto isApproved')
      .populate('region', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('vendorId', 'fullName businessName phone passportPhoto institution isApproved createdAt')
    .populate('region', 'name');

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Increment views
  await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  res.json({ success: true, product });
};

exports.updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (product.vendorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
  }

  const { title, description, price, category, condition, negotiable, isAvailable } = req.body;
  const updates = { title, description, category, condition };

  if (price !== undefined) updates.price = Number(price);
  if (negotiable !== undefined) updates.negotiable = negotiable === 'true';
  if (isAvailable !== undefined) updates.isAvailable = isAvailable === 'true';

  if (req.files && req.files.length > 0) {
    updates.images = req.files.map((file) => file.path);
  }

  product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate('vendorId', 'fullName businessName phone');

  res.json({ success: true, product });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (product.vendorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
  }

  await product.deleteOne();

  res.json({ success: true, message: 'Product deleted successfully' });
};

exports.getVendorProducts = async (req, res) => {
  const vendorId = req.params.vendorId || req.user._id;
  const { page = 1, limit = 12 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find({ vendorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments({ vendorId }),
  ]);

  res.json({
    success: true,
    products,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
};

exports.flagProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isFlagged: true, flagReason: req.body.reason },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, message: 'Product flagged for review', product });
};
