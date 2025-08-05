const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middlewares/auth');
const { EmologHistory, sequelize, Subdistrict } = require('../models');

router.get("/", jwtAuthMiddleware, async (req, res) => {
    try {

        // const keyword = req.query.;
        const rawData = await EmologHistory.findAll({
            attributes: ['subdistrict_id',
                [sequelize.fn('COUNT', sequelize.col('emotion_label')), 'emotion_count'],
                'emotion_label'
            ],
            include: [
                {
                    model: Subdistrict,
                    attributes: ['id', 'name'],
                    required: false
                },
            ],
            group: ['subdistrict_id', 'emotion_label', 'Subdistrict.id', 'Subdistrict.name'],
            raw: true
        });

        const grouped = {};

        rawData.forEach(item => {
            const subdistrictId = item['Subdistrict.id']
            const subdistrictName = item['Subdistrict.name'];
            const emotion = item['emotion_label'];
            const count = parseInt(item['emotion_count']);

            if (!grouped[subdistrictName]) {
                grouped[subdistrictName] = {
                    subdistrict_id : subdistrictId,
                    subdistrict: subdistrictName,
                    emotions: {},
                    total_entries: 0
                };
            }

            grouped[subdistrictName].emotions[emotion] = count;
            grouped[subdistrictName].total_entries += count;
        });

        const result = Object.values(grouped);

        res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching emolog cluster:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;