const express = require('express');
const router = express.Router();
const { PsikologProfile, User } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { nama_tempat_praktek, alamat_tempat_praktek, psikolog_id } = req.body;

    const existing = await PsikologProfile.findOne({ where: { psikolog_id } });
    if (existing) {
      return res.status(409).json({ message: 'psikolog profile sudah ada' });
    }
    const checkPsikolog = await User.findOne({ where: { id: psikolog_id, role: 'psikolog' } });
    if (!checkPsikolog) {
      return res.status(404).json({ message: 'User bukan psikolog' });
    }

    // Simpan ke database
    const data = await PsikologProfile.create({
      nama_tempat_praktek,
      alamat_tempat_praktek,
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
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const data = await PsikologProfile.findOne({ where: { id: id } });
    if (!data) {
      return res.status(404).json({ error: 'psikolog not found' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
module.exports = router;
