const express = require('express');
const router = express.Router();
const { Op, where } = require("sequelize");
const { jwtAuthMiddleware } = require('../middlewares/auth');
const { EmologHistory, sequelize, Subdistrict, District, User, UserProfile } = require('../models');
const { use } = require('react');

router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const {
      group_by = 'subdistrict',
      start_date,
      end_date,
      emotion,
      gender
    } = req.query;

     const userProfile = await UserProfile.findAll(
        {where: {gender: gender},
        attributes:[
        'user_id',
        'gender',
      ],
      include: [
        {
          model: User,
          attributes: ['id'],
          required: false
        }
      ]
    });

    const userIds = userProfile.map(up => up.user_id);

    let zoneColumn = 'subdistrict_id';
    let zoneModel = Subdistrict;
    let zoneAlias = 'Subdistrict';

    if (group_by === 'district') {
      zoneColumn = 'district_id';
      zoneModel = District;
      zoneAlias = 'District';
    }

    const whereConditions = {};

    if (gender) {
      whereConditions.user_id = {
        [Op.in]: userIds
      }
    }

    if (start_date && end_date) {
      whereConditions.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    } else if (start_date) {
      whereConditions.created_at = {
        [Op.gte]: new Date(start_date)
      };
    } else if (end_date) {
      whereConditions.created_at = {
        [Op.lte]: new Date(end_date)
      };
    }

    if (emotion) {
      const emotionList = emotion.split(',').map(e => e.trim());
      whereConditions.emotion_label = {
        [Op.in]: emotionList
      };
    } 

    const includeModels = [
      {
        model: zoneModel,
        attributes: ['id', 'name'],
        required: false
      }
    ];

    const rawData = await EmologHistory.findAll({
      attributes: [
        zoneColumn,
        [sequelize.fn('COUNT', sequelize.col('emotion_label')), 'emotion_count'],
        'emotion_label'
      ],
      include: includeModels,
      where: whereConditions,
      group: [zoneColumn, 'emotion_label', `${zoneAlias}.id`, `${zoneAlias}.name`],
      raw: true
    });

    const grouped = {};
    rawData.forEach(item => {
      const zoneId = item[`${zoneAlias}.id`];
      const zoneName = item[`${zoneAlias}.name`];
      const emotion = item['emotion_label'];
      const count = parseInt(item['emotion_count']);

      if (!grouped[zoneName]) {
        grouped[zoneName] = {
          [zoneColumn]: zoneId,
          name: zoneName,
          emotions: {},
          total_entries: 0
        };
      }

      grouped[zoneName].emotions[emotion] = count;
      grouped[zoneName].total_entries += count;
    });



    let result = Object.values(grouped);

      if (result.length === 0) {
      return res.status(200).json({
        message: `Tidak ada data emolog untuk filter yang diberikan`,
        data: []
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching emolog cluster:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;