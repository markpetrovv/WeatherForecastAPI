const socketIO = require('socket.io');

let io;
const weatherData = {};

function init(server) {
  io = socketIO(server);
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Send the latest weather data to the newly connected client
    for (const city in weatherData) {
      socket.emit('weather update', weatherData[city]);
    }

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

function broadcastWeatherUpdate(city, country, temp) {
  const data = {city, country, temp};
  weatherData[city.toLowerCase()] = data;
  io.emit('weather update', data);
}

module.exports = {init, broadcastWeatherUpdate};
