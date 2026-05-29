const multer = require('multer');

const cloudinaryEnabled =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let cloudinary = null;
let uploadProductImages, uploadVerificationDocs;

if (cloudinaryEnabled) {
  cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const createStorage = (folder) =>
    new CloudinaryStorage({
      cloudinary,
      params: {
        folder: `ttu-dwaso/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
      },
    });

  const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'), false);
  };

  uploadProductImages = multer({
    storage: createStorage('products'),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  });

  uploadVerificationDocs = multer({
    storage: createStorage('verifications'),
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024, files: 3 },
  });
} else {
  console.log('⚠️  Cloudinary not configured — file uploads disabled');
  const memStorage = multer({ storage: multer.memoryStorage() });
  uploadProductImages = memStorage;
  uploadVerificationDocs = memStorage;
}

module.exports = { cloudinary, uploadProductImages, uploadVerificationDocs, cloudinaryEnabled };
