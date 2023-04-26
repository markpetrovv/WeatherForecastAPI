const express = require('express')
const exphbs = require('express-handlebars')
const app = express();
const axios = require('axios');
const path = require('path');
// I implemented this one in order to avoid the code duplication in index.js and weatherController.js
const weatherController = require('./controllers/weatherController');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.engine('.hbs', exphbs.engine({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, 'views'));

app.get('/weather', weatherController.getWeatherData);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));