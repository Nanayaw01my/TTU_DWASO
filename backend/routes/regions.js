const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getRegions,
  getRegionWithInstitutions,
  getAllRegionsWithInstitutions,
  createRegion,
  updateRegion,
  addInstitution,
  updateInstitution,
  deleteInstitution,
} = require('../controllers/regionController');

router.get('/', getRegions);
router.get('/full', getAllRegionsWithInstitutions);
router.get('/:regionId/institutions', getRegionWithInstitutions);

// Admin only
router.post('/', protect, authorize('admin'), createRegion);
router.put('/:id', protect, authorize('admin'), updateRegion);
router.post('/:regionId/institutions', protect, authorize('admin'), addInstitution);
router.put('/:regionId/institutions/:institutionId', protect, authorize('admin'), updateInstitution);
router.delete('/:regionId/institutions/:institutionId', protect, authorize('admin'), deleteInstitution);

module.exports = router;
