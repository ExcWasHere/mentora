const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const process = require('process');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const psikologProfileRoutes = require('./routes/psikologProfile');
const psikologScheduleRoutes = require('./routes/psikologSchedule');
const userProfileRoutes = require('./routes/userProfile');
const emologHistoryRoutes = require('./routes/emologHistory');
const appointmentRoutes = require('./routes/appointment');
const emologClusterRoutes = require('./routes/emologCluster');
const aloraRoutes = require('./routes/alora');
const db = require('./models');
const emologRoutes = require('./routes/emolog');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.get('/', (req, res) => res.send('Hello, World!'));
app.use('/api/auth', authRoutes);
app.use('/api/emolog', emologRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/psikolog-profile', psikologProfileRoutes);
app.use('/api/schedule', psikologScheduleRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/profile', userProfileRoutes);
app.use('/api/emolog-history', emologHistoryRoutes);
app.use('/api/emolog-cluster', emologClusterRoutes);
app.use('/api/alora', aloraRoutes);

db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
  });
});
