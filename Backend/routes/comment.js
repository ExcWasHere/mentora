const express = require('express');
const { jwtAuthMiddleware } = require('../middlewares/auth');
const { Post, Comment } = require('../models');
const router = express.Router();

router.post('/', jwtAuthMiddleware, async (req, res) => {
  try {
    const { comment, post_id } = req.body;
    const user_id = req.user.id;
    if (!comment || !post_id) {
      return res.status(400).json({ message: 'comment dan post_id harus diisi!' });
    }
    const checkPost = await Post.findByPk(post_id);
    if (!checkPost) {
      return res.status(404).json({ message: 'postingan tidak ditemukan' });
    }
    const data = await Comment.create({
      user_id,
      post_id,
      comment,
    });
    return res.status(201).json({ message: 'comment berhasil dibuat', data });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const data = await Comment.findAll();
    res.status(200).json({ message: 'berhasil mengambil data', data });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.get('/:id', async (req, res) => {
  //get all comment for 1 post
  try {
    const id = req.params.id;
    const data = await Comment.findAll({ where: { post_id: id } });
    res.status(200).json({ message: 'berhasil mengambil data', data });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.get('/getById/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Comment.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: 'comment tidak ditemukan' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.put('/:id', jwtAuthMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const comment = req.body;
    const id = req.params.id;
    if (!comment) {
      return res.status(400).json({ message: 'comment harus diisi!' });
    }
    const check = await Comment.findOne({ where: { id: id, user_id: user_id } });
    if (!check) {
      return res.status(404).json({ message: 'comment tidak ditemukan' });
    }
    await Comment.update(comment, {
      where: {
        id: id,
        user_id: user_id,
      },
    });
    res.status(200).json({ message: 'Comment berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const id = req.params.id;
    const check = await Comment.findOne({ where: { id: id, user_id: user_id } });
    if (!check) {
      return res.status(404).json({ message: 'comment tidak ditemukan' });
    }
    await Comment.destroy({
      where: {
        id: id,
        user_id: user_id,
      },
    });
    res.status(200).json({ message: 'Comment berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan', error: err.message });
  }
});
module.exports = router;
