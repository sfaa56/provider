const City = require('../models/City');
const joi = require('joi');

// Validation schema
const citySchema = joi.object({
  name: joi.string().required(),
  region: joi.string().required(),
  isActive: joi.boolean().default(true)
});

exports.createCity = async (req, res) => {
  // Validate the request body
  const { error } = citySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to create a city' });
  }

  try {
    const city = await City.create(req.body);
    res.status(201).json(city);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find().populate('region');
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCity = async (req, res) => {

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to update a city' });
  }
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(city);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCity = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to delete a city' });
  }
    const city = req.params.id;
  try {

    const userUsingCity = await User.findOne({ city });

    if (userUsingCity) {
      return res
        .status(400)
        .json({ message: 'City is in use by a user' });
    }


    await City.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'City deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
