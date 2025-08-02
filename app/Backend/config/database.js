const { Sequelize } = require('sequelize');
require('dotenv').config();
const process = require('process');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  timezone: '+07:00',
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to MySQL database:', error.message);
  }
};

testConnection();

module.exports = sequelize;
