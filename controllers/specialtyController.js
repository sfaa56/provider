// controllers/specialtyController.js
const Specialty = require('../models/Specialty');

exports.createSpecialty = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const { name, description } = req.body;
    const specialty = new Specialty({ name, description });
    await specialty.save();
    res.status(201).json(specialty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find();
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
