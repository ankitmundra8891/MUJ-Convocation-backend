const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const constants = require('./config/dev');
const errorHandler = require('./middleware/error');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

//App Routes
const authRoutes = require('./route/auth');

const studentRoute = require('./route/student');
const dueRoute = require('./route/due');

//App initialization
const app = express();
app.use(cors());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(morgan('dev'));
app.use(cors());
//App utilities
app.use(express.static(path.join(__dirname, 'Public')));
app.use(bodyParser.urlencoded({ extended: false })); //x-www-form-urlencoded
app.use(
  bodyParser.json({
    limit: '50mb',
    extended: true,
  })
); //application/json
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 15728640 },
  }).fields([
    { name: 'pan_attachment', maxCount: 1 },
    { name: 'gst_attachment', maxCount: 1 }, //need to be done 5
    { name: 'msme_attachment', maxCount: 1 },
    { name: 'bank_cancelled_cheque', maxCount: 1 },
  ])
);

app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/student', studentRoute);
app.use('/due', dueRoute);
// app.use('/nopandata', noPanDataRoutes);
// app.use('/images', express.static('images'));

// //Handling error and response
// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({ message: message, data: data });
// });

app.use(errorHandler);
//Mongoose connection
//LOCAL URL - mongodb://localhost:27017/test

let port = 5000;
mongoose
  .connect(constants.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    app.listen(port);
  })
  .then((res) => {
    console.log('Hey we are good to go');
  })
  .catch((error) => {
    console.log(error);
  });
