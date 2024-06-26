const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const corsOptions = {
  origin: 'https://webdoan-ui.vercel.app',
  optionsSuccessStatus: 200,
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(cors(corsOptions));
app.use(fileUpload({
  useTempFiles: true,
}));

// Routes
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/paymentRouter'));

// Connect mongoose DB
const URI = process.env.MONGODB_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

connectToDatabase();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server đang chạy trên cổng", PORT);
});
