const express = require('express');
const Bike = require('../models/Bike');
const { protect } = require('../middleware/authMiddelware');
const router = express.Router();

// Create a bike
router.post('/', protect, async (req, res) => {
  try {
    const newBike = new Bike(req.body);
    const savedBike = await newBike.save();
    res.status(201).json(savedBike);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all bikes
router.get('/', protect, async (req, res) => {
  const bikes = await Bike.find().populate('seller');
  res.json(bikes);
});

// Get a single bike
router.get('/:id', protect, async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate('seller');
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    res.json(bike);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    // Only the owner can update
    if (bike.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    bike.title = req.body.title || bike.title;
    bike.description = req.body.description || bike.description;
    bike.price = req.body.price || bike.price;
    bike.category = req.body.category || bike.category;
    bike.condition = req.body.condition || bike.condition;
    bike.imageUrl = req.body.imageUrl || bike.imageUrl;
    bike.latitude = req.body.latitude || bike.latitude;
    bike.longitude = req.body.longitude || bike.longitude;
    bike.isCheck = req.body.isCheck || bike.isCheck;
    bike.isSold = req.body.isSold !== undefined ? req.body.isSold : bike.isSold;

    const updatedBike = await bike.save();
    res.json(updatedBike);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a bike (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    // Only the owner can delete
    if (bike.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await bike.remove();
    res.json({ message: 'Bike deleted successfully' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
