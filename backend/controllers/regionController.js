const Region = require('../models/Region');

exports.getRegions = async (req, res) => {
  const regions = await Region.find({ isActive: true }, 'name code').sort('name');
  res.json({ success: true, regions });
};

exports.getRegionWithInstitutions = async (req, res) => {
  const region = await Region.findById(req.params.regionId);
  if (!region) {
    return res.status(404).json({ success: false, message: 'Region not found' });
  }
  const institutions = region.institutions.filter((i) => i.isActive);
  res.json({ success: true, institutions });
};

exports.getAllRegionsWithInstitutions = async (req, res) => {
  const regions = await Region.find({ isActive: true }).sort('name');
  res.json({ success: true, regions });
};

exports.createRegion = async (req, res) => {
  const region = await Region.create(req.body);
  res.status(201).json({ success: true, region });
};

exports.updateRegion = async (req, res) => {
  const region = await Region.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!region) return res.status(404).json({ success: false, message: 'Region not found' });
  res.json({ success: true, region });
};

exports.addInstitution = async (req, res) => {
  const region = await Region.findById(req.params.regionId);
  if (!region) return res.status(404).json({ success: false, message: 'Region not found' });

  region.institutions.push(req.body);
  await region.save();

  res.status(201).json({ success: true, region });
};

exports.updateInstitution = async (req, res) => {
  const region = await Region.findById(req.params.regionId);
  if (!region) return res.status(404).json({ success: false, message: 'Region not found' });

  const inst = region.institutions.id(req.params.institutionId);
  if (!inst) return res.status(404).json({ success: false, message: 'Institution not found' });

  Object.assign(inst, req.body);
  await region.save();

  res.json({ success: true, region });
};

exports.deleteInstitution = async (req, res) => {
  const region = await Region.findById(req.params.regionId);
  if (!region) return res.status(404).json({ success: false, message: 'Region not found' });

  region.institutions.pull({ _id: req.params.institutionId });
  await region.save();

  res.json({ success: true, message: 'Institution removed' });
};
