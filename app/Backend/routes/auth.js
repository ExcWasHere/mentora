const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { strProof } = require('../utils/upload');

router.post('/register', strProof.single('str_proof'), async (req, res) => {
  console.log(req.body);
  const { name, email, password, role, nip } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email sudah terdaftar' });

    let newUserData = { name, email, password: await hashPassword(password), role };

    if (role === 'pemerintah') {
      if (!nip) {
        return res.status(400).json({ error: 'NIP wajib diisi untuk role Pemerintah' });
      }
      newUserData.nip = nip;
    }
    if (role === 'psikolog') {
      if (!req.file) {
        return res.status(400).json({ error: 'str_proof wajib diisi untuk role Psikolog' });
      }
      newUserData.str_proof = req.file.filename;
    }

    const user = await User.create(newUserData);
    console.log('User created:', { id: user.id, name: user.name, email: user.email });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Email tidak terdaftar' });
    }

    const compare = await comparePassword(password, user.password);
    if (!compare) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'password salah' });
    }

    console.log('Login successful for user:', {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    const responseData = {
      id: user.id,
      name: user.name || user.email.split('@')[0],
      email: user.email,
    };

    console.log('Sending response data:', responseData);
    res.json(responseData);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Fetched user data:', {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/debug/session', (req, res) => {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json({
    hasSession: !!req.session,
    sessionData: req.session || {},
  });
});

module.exports = router;
