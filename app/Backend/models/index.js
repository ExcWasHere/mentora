const Sequelize = require('sequelize');
const sequelize = require('../config/database.js');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Emotion = require('./emotion')(sequelize, Sequelize.DataTypes);
db.Post = require('./post')(sequelize, Sequelize.DataTypes);
db.UserProfile = require('./userprofiles')(sequelize, Sequelize.DataTypes);
db.District = require('./district.js')(sequelize, Sequelize.DataTypes);
db.Subdistrict = require('./subdistrict.js')(sequelize, Sequelize.DataTypes);
db.EmologHistory = require('./emologhistories')(sequelize, Sequelize.DataTypes);
db.PsikologProfile = require('./psikolog-profile')(sequelize, Sequelize.DataTypes);
db.PsikologSchedule = require('./psikolog-schedule')(sequelize, Sequelize.DataTypes);
db.ChatbotHistory = require('./chatbot-histories')(sequelize, Sequelize.DataTypes);
db.Appointment = require('./appointment')(sequelize, Sequelize.DataTypes);
db.ChatbotSession = require('./chatbot-sessions')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;
