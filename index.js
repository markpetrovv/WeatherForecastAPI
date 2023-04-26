const express = require('express')
const exphbs = require('express-handlebars')
const app = express();
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('./middlewares/authMiddleware');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const userRoutes = require('./routes/user');
require('./passport-config')(passport);

// I implemented this one in order to avoid the code duplication in index.js and weatherController.js
const weatherController = require('./controllers/weatherController');
const favoriteLocationRoute = require('./routes/favoriteLocation');

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
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);
app.use(passport.initialize());
app.use(passport.session());

// home route
app.get('/', (req, res) => {
  res.render('home', { user: req.session.user });
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
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));