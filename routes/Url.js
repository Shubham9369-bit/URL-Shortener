const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const shortid = require('shortid');

// Shorten URL route
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    // Agar user ne custom code diya hai to use karo, warna random generate karo
    const shortCode = customCode && customCode.trim() !== "" ? customCode : shortid.generate();

    // Check karo ki code already exist na kare
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.status(400).json({ error: "Short code already taken!" });
    }

    // Save new URL
    const newUrl = new Url({ originalUrl, shortCode });
    await newUrl.save();

    res.json({ shortUrl: `http://localhost:5000/${shortCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect route
router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Click count +1
    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
