const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const process = require('process');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
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

db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});
