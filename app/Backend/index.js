const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const process = require('process');
const authRoutes = require('./routes/auth');
const db = require('./models');
const emologRoutes = require('./routes/emolog');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.get('/', (req, res) => res.send('Hello, World!'));
app.use('/api/auth', authRoutes);
app.use('/api/emolog', emologRoutes);

db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});
