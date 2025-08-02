const express = require('express')
const jwt = require('jsonwebtoken');
const { User } = require('../models');


const jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      status: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET;

async function getUserById(userId) {
  const user = await User.findByPk(userId, {
      attributes: ['id','email'],
    });
  return user;
}

  try {
    const decoded = jwt.verify(token, secretKey);

    getUserById(decoded.id)
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            code: 401,
            status: 'User not found',
          });
        }

        req.user = {
          id: decoded.id,
          email: decoded.email,
          exp: decoded.exp,
        };

        next();
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          code: 500,
          status: 'Internal Server Error',
        });
      });
  } catch (err) {
    return res.status(401).json({
      code: 401,
      status: 'Unauthorized',
    });
  }
};

module.exports = { jwtAuthMiddleware };
