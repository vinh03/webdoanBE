const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');


const path = require('path');


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(cors())
app.use(fileUpload({
    useTempFiles: true,
}))

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))

//connect mongoose DB
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
app.use(function(req, res, next) {
  const allowedOrigins = ['https://deploymentshop.onrender.com', 'https://ui-shop.vercel.app/'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Expose-Headers', 'agreementrequired');
  next();
});
connectToDatabase();

if(process.env.NODE_ENV === 'production'){
  
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    });
   
}

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log("Server đang chạy trên cổng", PORT)
})