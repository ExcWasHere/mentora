const express = require('express');
const router = express.Router();
const { Subdistrict, EmologHistory, District } = require('../models');
const { jwtAuthMiddleware } = require('../middlewares/auth');
const axios = require('axios');
const district = require('../models/district');
require('dotenv').config();
const emologEndpoint = process.env.EMOLOG_ENDPOINT;

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const { text, subdistrict_id } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    if (!text || !subdistrict_id) {
      return res.status(400).json({ error: "Text input and subdistrict_id are required" });
    }

    const subdistrict = await Subdistrict.findOne({
      where: { id: subdistrict_id },
    });

    if (!subdistrict) {
      return res.status(400).json({
        error: "Subdistrict not found or not belong to selected district",
      });
    }

    const response = await axios.post(emologEndpoint, {
      text: text,
      subdistrict_id: subdistrict_id
    });

    const { emotion_label } = response.data;

    await EmologHistory.create({
      user_id: userId,
      subdistrict_id: subdistrict_id,
      district_id: subdistrict.district_id,
      emotion_label,
      text_input: text,
      recorded_at: new Date(),
    });

    res.status(201).json({
      message: "Emolog history recorded",
      emotion_label,
    });
  } catch (error) {
    console.error("Get emolog history:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const emologHistory = await EmologHistory.findAll(
        {where: {user_id: userId},
        attributes:[
        'user_id',
        'emotion_label',
        'text_input',
        'subdistrict_id',
        'recorded_at',
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: Subdistrict,
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    if (!emologHistory) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(emologHistory);

  } catch (error) {
    console.error('Get emolog history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;