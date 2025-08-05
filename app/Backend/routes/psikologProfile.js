const express = require('express');
const router = express.Router();
const { PsikologProfile } = require('../models');
const { jwtAuthMiddleware, checkPsikolog } = require('../middlewares/auth');

router.post('/', jwtAuthMiddleware, checkPsikolog, async (req, res) => {
  try {
    const { nama_tempat_praktek, alamat_tempat_praktek, pengalaman_dalam_tahun } = req.body;
    const psikolog_id = req.user.id;

    if (!nama_tempat_praktek || !alamat_tempat_praktek || !pengalaman_dalam_tahun) {
      return res.status(400).json({ message: 'nama_tempat_praktek, alamat_tempat_praktek, pengalaman_dalam_tahun wajib diisi.' });
    }
    const existing = await PsikologProfile.findOne({ where: { psikolog_id } });
    if (existing) {
      return res.status(409).json({ message: 'psikolog profile sudah ada' });
    }

    // Simpan ke database
    const data = await PsikologProfile.create({
      nama_tempat_praktek,
      alamat_tempat_praktek,
      pengalaman_dalam_tahun,
      psikolog_id,
    });

    res.status(201).json({
      message: 'psikolog profile berhasil dibuat',
      data,
    });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await PsikologProfile.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});

router.get('/me', jwtAuthMiddleware, checkPsikolog, async (req, res) => {
  try {
    const id = req.user.id;

    const data = await PsikologProfile.findOne({ where: { psikolog_id: id } });
    console.log(data);

    if (!data) {
      return res.status(404).json({ error: 'psikolog not found' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
module.exports = router;
