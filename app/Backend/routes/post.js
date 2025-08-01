const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');
const { postImage } = require('../utils/upload');

router.post('/', postImage.array('images', 5), async (req, res) => {
  try {
    const { content, user_id } = req.body;

    if (!content || !user_id) {
      return res.status(400).json({ message: 'content dan user_id wajib diisi.' });
    }

    const checkUser = await User.findByPk(user_id);
    if (!checkUser) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Ambil nama-nama file gambar (jika ada)
    const imageFiles = req.files?.map((file) => file.filename) || [];
    console.log(req.files);

    // Simpan ke database
    const postingan = await Post.create({
      content,
      user_id,
      images: imageFiles.length > 0 ? imageFiles : null, // simpan null kalau kosong
    });

    res.status(201).json({
      message: 'Postingan berhasil dibuat',
      postingan,
    });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await Post.findAll();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Post.findByPk(id);
    if (!data) {
      return res.status(404).json({ error: 'Postingan not found' });
    }
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
module.exports = router;
