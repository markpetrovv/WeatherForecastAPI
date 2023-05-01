const express = require('express')
const exphbs = require('express-handlebars')
const app = express();
const axios = require('axios');
const path = require('path');
// I implemented this one in order to avoid the code duplication in index.js and weatherController.js
const weatherController = require('./controllers/weatherController');
const server = require('http').Server(app);
const io = require('socket.io')(server);

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
    const { temp, city, country } = await getWeatherData(location);
    res.render('weather', { temp, city, country });
  } catch (error) {
    res.render('weather', { error: error.message });
  }
});

io.on('connection', async (socket) => {
  console.log('A client connected.');

  // Send the current temperature to the client
  try {
    const { temp } = await getWeatherData('location');
    socket.emit('temperatureUpdate', temp);
  } catch (error) {
    console.log(error);
  }
});

io.on('connect', () => {
  console.log('Connected to the server via Socket.IO');
});

// Log a message when the connection is lost
io.on('disconnect', () => {
  console.log('Disconnected from the server via Socket.IO');
});

// Log a message when a temperature update is received
io.on('temperatureUpdate', (temp) => {
  console.log(`Received temperature update: ${temp}°C`);
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
