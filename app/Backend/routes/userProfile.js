const express = require('express');
const router = express.Router();
const { UserProfile, District, Subdistrict } = require('../models');
const { jwtAuthMiddleware } = require('../middlewares/auth');

router.get('/', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId },
      attributes: ['user_id', 'district_id', 'subdistrict_id', 'gender', 'birthdate', 'no_wa', 'created_at', 'updated_at'],
      include: [
        {
          model: District,
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: Subdistrict,
          attributes: ['id', 'name'],
          required: false,
        },
      ],
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { district_id, subdistrict_id, gender, birthdate, no_wa } = req.body;

    if (!district_id || !subdistrict_id || !gender || !birthdate || !no_wa) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['L', 'P'].includes(gender)) {
      return res.status(400).json({ error: 'Gender must be L or P' });
    }

    const existingProfile = await UserProfile.findOne({
      where: { user_id: userId },
    });

    if (existingProfile) {
      return res.status(409).json({ error: 'Profile already exists' });
    }

    const district = await District.findByPk(district_id);
    if (!district) {
      return res.status(400).json({ error: 'District not found' });
    }

    const subdistrict = await Subdistrict.findOne({
      where: {
        id: subdistrict_id,
        district_id: district_id,
      },
    });
    if (!subdistrict) {
      return res.status(400).json({ error: 'Subdistrict not found or not belong to selected district' });
    }

    const newProfile = await UserProfile.create({
      user_id: userId,
      district_id,
      subdistrict_id,
      gender,
      birthdate,
      no_wa,
    });

    res.status(201).json({
      message: 'Profile created successfully',
      profile: newProfile,
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { district_id, subdistrict_id, gender, birthdate, no_wa } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const existingProfile = await UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!existingProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updateData = {};

    if (district_id !== undefined) {
      const district = await District.findOne({
        where: { id: district_id },
      });
      if (!district) {
        return res.status(400).json({ error: 'District not found' });
      }
      updateData.district_id = district_id;
    }

    if (subdistrict_id !== undefined) {
      const targetDistrictId = district_id || existingProfile.district_id;
      const subdistrict = await Subdistrict.findOne({
        where: {
          id: subdistrict_id,
          district_id: targetDistrictId,
        },
      });
      if (!subdistrict) {
        return res.status(400).json({ error: 'Subdistrict not found or not belong to selected district' });
      }
      updateData.subdistrict_id = subdistrict_id;
    }

    if (gender !== undefined) {
      if (!['L', 'P'].includes(gender)) {
        return res.status(400).json({ error: 'Gender must be L or P' });
      }
      updateData.gender = gender;
    }

    if (birthdate !== undefined) {
      updateData.birthdate = birthdate;
    }
    if (no_wa !== undefined) {
      updateData.no_wa = no_wa;
    }

    await UserProfile.update(updateData, {
      where: { user_id: userId },
    });

    const updatedProfile = await UserProfile.findOne({
      where: { user_id: userId },
      include: [
        {
          model: District,
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: Subdistrict,
          attributes: ['id', 'name'],
          required: false,
        },
      ],
    });

    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
