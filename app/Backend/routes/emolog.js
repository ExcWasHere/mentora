const express = require('express');
const router = express.Router();
const { Emotion } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');

// router.post("/", async (req, res) => {
//   const { user_id, emotion, note, interaction_with, activity, mood, date } =
//     req.body;

//   try {
//     const newEmotion = await Emotion.create({
//       user_id,
//       emotion,
//       note,
//       interaction_with,
//       activity,
//       mood,
//       date,
//     });
//     res.status(201).json(newEmotion);
//   } catch (err) {
//     console.error("Gagal menyimpan emosi:", err);
//     res.status(500).json({ error: "Gagal menyimpan emosi" });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const { text, subdistrict_id } = req.body;
    const response = await axios.post('https://z7zb93qs-8000.asse.devtunnels.ms/api/predict', {
      text,
      subdistrict_id,
    });
    console.log(response);

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.get('/', async (req, res) => {
  const { user_id, period = 7 } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  const rawDate = new Date();
  rawDate.setDate(rawDate.getDate() - Number(period));
  const dateLimit = rawDate.toISOString().split('T')[0];

  console.log('Querying emolog for user:', user_id);
  console.log('Tanggal batas:', dateLimit);

  try {
    const history = await Emotion.findAll({
      where: {
        user_id,
        date: {
          [Op.gte]: dateLimit,
        },
      },
      order: [['date', 'DESC']],
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error while fetching emolog:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
