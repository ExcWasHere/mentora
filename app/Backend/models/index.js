const Sequelize = require('sequelize');
const sequelize = require('../config/database.js');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Emotion = require('./emotion')(sequelize, Sequelize.DataTypes);
db.Post = require('./post')(sequelize, Sequelize.DataTypes);
db.UserProfile = require('./userprofiles')(sequelize, Sequelize.DataTypes);
db.PsikologProfile = require('./psikolog-profile')(sequelize, Sequelize.DataTypes);
Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;
