const express = require('express');
const router = express.Router();
const { PsikologSchedule } = require('../models');
const { jwtAuthMiddleware, checkPsikolog } = require('../middlewares/auth');

router.post('/', jwtAuthMiddleware, checkPsikolog, async (req, res) => {
  try {
    const { date, start_time, end_time, kuota } = req.body;
    const psikolog_id = req.user.id;
    if (!date || !start_time || !end_time || !kuota) {
      return res.status(400).json({ message: 'date, start_time, end_time, kuota wajib diisi.' });
    }

    const existing = await PsikologSchedule.findOne({
      where: {
        psikolog_id: psikolog_id,
        date: date,
        start_time: start_time,
        end_time: end_time,
      },
    });
    if (existing) {
      return res.status(409).json({ message: 'psikolog schedule sudah ada. tidak bisa duplikat' });
    }

    // Simpan ke database
    const data = await PsikologSchedule.create({
      date,
      start_time,
      end_time,
      kuota,
      psikolog_id,
    });

    res.status(201).json({
      message: 'psikolog schedule berhasil dibuat',
      data,
    });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await PsikologSchedule.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.get('/getById/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const data = await PsikologSchedule.findOne({ where: { id: id } });
    if (!data) {
      return res.status(404).json({ error: 'psikolog schedule not found' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.get('/psikolog/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const data = await PsikologSchedule.findAll({ where: { psikolog_id: id } });
    if (!data) {
      return res.status(404).json({ error: 'psikolog schedule not found' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.get('/me', jwtAuthMiddleware, checkPsikolog, async (req, res) => {
  try {
    const id = req.user.id;

    const data = await PsikologSchedule.findAll({ where: { psikolog_id: id } });
    if (!data) {
      return res.status(404).json({ error: 'psikolog schedule not found' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
module.exports = router;
