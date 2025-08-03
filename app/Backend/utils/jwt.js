require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

console.log('JWT_SECRET:', jwtSecret);

const generateJwtToken = async (id, email, role) => {
  if (!id || !email) {
    throw new Error('ID and email are required');
  }

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload = {
    id: id,
    email: email,
    role: role,
  };

  try {
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

    return token;
  } catch (error) {
    throw new Error('Failed to generate JWT token: ' + error.message);
  }
};

module.exports = { generateJwtToken };
