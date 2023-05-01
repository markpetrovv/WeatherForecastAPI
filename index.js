const express = require('express')
const exphbs = require('express-handlebars')
const app = express();
const axios = require('axios');
const path = require('path');
const weatherController = require('./controllers/weatherController');
const server = require('http').Server(app);
const socket = require('socket.io')(server);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.engine('.hbs', exphbs.engine({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

const { getWeatherData } = require('./controllers/weatherController');

app.get('/weather', async (req, res) => {
  const { location } = req.query;

  try {
    const { temp, city, country } = await getWeatherData(location, socket);
    res.render('weather', { temp, city, country });
  } catch (error) {
    res.render('weather', { error: error.message });
  }
});

socket.on('connection', async (socket) => {
  console.log('A client connected.');

  try {
    const { temp } = await getWeatherData('location', socket);
    socket.emit('temperatureUpdate', temp);
  } catch (error) {
    console.log(error);
  }
});

socket.on('connect', () => {
  console.log('Connected to the server via Socket.IO');
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server via Socket.IO');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

