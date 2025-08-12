const express = require("express");
const router = express.Router();
const { sequelize, ChatbotHistory, ChatbotSession } = require("../models");
const { jwtAuthMiddleware } = require("../middlewares/auth");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const aloraEndpoint = process.env.ALORA_ENDPOINT;

router.get("/sessions", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const sessions = await ChatbotSession.findAll({
      where: { user_id: userId },
      attributes: [
        'id',          
        'user_id',
        'title',
        'last_message_at',
        'created_at',
        'updated_at'
      ],
      order: [['updated_at', 'DESC']] 
    });

    return res.json(sessions);

  } catch (error) {
    console.error("Failed query sessions:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/new-chat", jwtAuthMiddleware, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { prompt } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }
    if (!prompt) {
      return res.status(400).json({ error: "Text input are required" });
    }

    const sessionId = uuidv4();

    await ChatbotSession.create(
      {
        id: sessionId,
        user_id: userId
      },
      { transaction: t } 
    );

    await ChatbotHistory.create(
      {
        user_id: userId,
        session_id: sessionId,
        sender: "user",
        message: prompt
      },
      { transaction: t }
    );

    const response = await axios.post(aloraEndpoint, {
      prompt: prompt
    });

    const { message } = response.data;

    await ChatbotHistory.create(
      {
        user_id: userId,
        session_id: sessionId,
        sender: "bot",
        message: message
      },
      { transaction: t }
    );

    const title = prompt.split(/\s+/).slice(0, 4).join(" ");
    const finalTitle = prompt.split(/\s+/).length > 4 ? `${title}...` : title;

    await ChatbotSession.update(
      {
        last_message_at: new Date(),
        title: finalTitle
      },
      { where: { id: sessionId }, transaction: t }
    );

    await t.commit();

    res
      .status(201)
      .set("Location", `/chat/${sessionId}`)
      .json({
        message: "Chat recorded",
        response: message,
        session_id: sessionId
      });

  } catch (error) {
    try { await t.rollback(); } catch {}
    console.error("Failed insert chat history:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/chat/:session_id", jwtAuthMiddleware, async (req, res) => {
  try {
    const { session_id } = req.params;
    const { prompt } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }
    if (!prompt) {
      return res.status(400).json({ error: "Text input are required" });
    }

    const response = await axios.post(aloraEndpoint, {
      prompt: prompt
    });

    const { message } = response.data;

    await ChatbotHistory.create({
      user_id: userId,
      session_id,
      sender: "user",
      message: prompt
    });

    await ChatbotHistory.create({
      user_id: userId,
      session_id,
      sender: "bot",
      message: message
    });

    res.status(201).json({
      message: "Chat recorded",
      response: message
    });

  } catch (error) {
    console.error("Failed insert chat history:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/chat/:session_id", jwtAuthMiddleware, async (req, res) => {
  try {
    const { session_id } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const chatbotHistories = await ChatbotHistory.findAll({
      where: { user_id: userId, session_id: session_id },
      attributes: [
        'user_id',
        'session_id',
        'sender',
        'message',
        'created_at',
        'updated_at'
      ],
      order: [['created_at', 'ASC']] 
    });

    return res.json(chatbotHistories);

  } catch (error) {
    console.error("Failed load chat:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
