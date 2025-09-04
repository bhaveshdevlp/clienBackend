const express = require('express');
const router = express.Router();
const Image = require('../model/images');

// GET all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET images by category
router.get('/category/:category', async (req, res) => {
  try {
    const images = await Image.find({ category: req.params.category }).sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new image
router.post('/', async (req, res) => {
  const image = new Image({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    url: req.body.url,
    public_id: req.body.public_id
  });

  try {
    const newImage = await image.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    
    // Here you would also delete from Cloudinary using the public_id
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;