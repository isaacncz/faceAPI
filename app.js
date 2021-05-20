var express = require('express');
var bodyParser = require('body-parser');
const morgan = require('morgan');
var passport = require('passport');
const methodOverride = require('method-override');

var app = express();

// Mongoose API
var userApi = require('./app/mongoose/routes/user/staffRoute');
const imageAPI = require('./app/mongoose/routes/imageRoute');
const attendanceAPI = require('./app/mongoose/routes/attendanceRoute');

// Body Parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Logging
app.use(morgan('combined'));

// Passport Config
require('./app/mongoose/config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CORS
var corsMiddleware = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); //replace localhost with actual host
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, PUT, PATCH, POST, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Requested-With, Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else next();
};
app.use(corsMiddleware);
app.use(methodOverride('_method'));
require('dotenv').config();

// Set up mongoose connection
var mongoose = require('mongoose');
const dev_db_url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

var mongoDB = dev_db_url;

mongoose
  .connect(mongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected'));
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//------- dont change------
// API URL
// mongoose routes
app.get('/', function (req, res) {
  res.json({ message: 'welcome to the api' });
});

app.use('/api/user', userApi);

app.use('/api/image', imageAPI);

app.use('/api/attendance', attendanceAPI);

// Testing Msg on Browser
app.get('/api/', (req, res) => {
  res.json({ message: 'Welcome to API.' });
});

// Testing Log
app.listen(process.env.PORT, () => {
  console.log('Server is up and running on port number ' + process.env.PORT);
});
