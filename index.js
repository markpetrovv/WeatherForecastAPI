const express = require('express')
const exphbs = require('express-handlebars')
const app = express();
const axios = require('axios');
const path = require('path');
const http = require('http');
const flash = require('connect-flash');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('./middlewares/authMiddleware');
const { init: initSocket } = require('./socketHelper');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const userRoutes = require('./routes/user');
require('./passport-config')(passport);

// I implemented this one in order to avoid the code duplication in index.js and weatherController.js
const weatherController = require('./controllers/weatherController');
const favoriteLocationRoute = require('./routes/favoriteLocation');
const server = http.createServer(app);

initSocket(server);

// database connection
mongoose.connect(process.env.mongoDB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// hbs
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
});
app.engine('.hbs', exphbs.engine({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// passport middleware and session configuration 
app.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true,  // new uninitialized session will be saved
    cookie: {maxAge: 24 * 60 * 60 * 1000}, // 24 hours
  })
);
app.use(flash());
app.use(passport.initialize()); // passport library initialization for authentication
app.use(passport.session());  // read and attach information to 'req.user' object

// home route
app.get('/', (req, res) => {
  res.render('home', {user: req.session.user});
});

// register and log in render calls
app.get('/register', (req, res) => {
  res.render('register', {user: req.user});
});

app.get('/login', (req, res) => {
  res.render('login', {user: req.user});
});

// favorite locations route
app.use('/favorite-locations', ensureAuthenticated, favoriteLocationRoute);

// weather route
app.get('/weather', weatherController.getWeatherData);

app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`App listening on port ${PORT}`));