const express = require('express');
const { jwtAuthMiddleware, checkUser } = require('../middlewares/auth');
const { StreakSelfHarm } = require('../models');
const router = express.Router();

router.post('/start', jwtAuthMiddleware, checkUser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const existing = await StreakSelfHarm.findOne({ where: { user_id } });
    if (existing) {
      return res.status(400).json({ message: 'User sudah punya data streak' });
    }
    const data = await StreakSelfHarm.create({
      user_id,
      streak_date: new Date(),
    });
    res.status(201).json({ message: 'streak self harm berhasil dibuat', data });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.put('/reset', jwtAuthMiddleware, checkUser, async (req, res) => {
  try {
    const user_id = req.user.id;

    const streak = await StreakSelfHarm.findOne({ where: { user_id } });
    if (!streak) {
      return res.status(404).json({ message: 'Streak tidak ditemukan' });
    }

    streak.streak_date = new Date(); // update ke hari ini
    await streak.save();

    res.json({ message: 'Streak direset', data: streak });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.get('/', jwtAuthMiddleware, checkUser, async (req, res) => {
  try {
    const user_id = req.user.id;

    const streak = await StreakSelfHarm.findOne({ where: { user_id } });
    if (!streak) {
      return res.json({ message: 'Belum ada streak', days: 0 });
    }

    const today = new Date();

    // hitung selisih hari
    const diffTime = today - streak.streak_date; //hasilnya ini dalam milidetik
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); //dibagi dulu untuk dijadikan hari

    res.json({ message: 'Berhasil ambil streak', days: diffDays });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});

module.exports = router;
