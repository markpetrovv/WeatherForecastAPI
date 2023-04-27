const axios = require('axios');

const apiKey = '2b0178ed403a29a18c24969970737398';
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';

async function getWeatherData(req, res) {
  const location = req.query.location;


  //using only finnish postal codes
  let queryUrl;
  if (/^\d{5}(?:\d{2})?$/.test(location)) {
    queryUrl = `${baseUrl}?zip=${location},fi&appid=${apiKey}&units=metric`;
  } else if (/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/.test(location)) {
    
    const [lat, lon] = location.split(',');
    queryUrl = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    queryUrl = `${baseUrl}?q=${location}&appid=${apiKey}&units=metric`;
  }

  try {
    const response = await axios.get(queryUrl);
    if (response.status === 200) {
      const data = response.data;
      const temp = data.main.temp;
      const city = data.name;
      const country = data.sys.country;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const weatherDescription = data.weather[0].description;
      res.render('weather', { temp, city, country, humidity, windSpeed, weatherDescription });
    } else {
      res.render('weather', { error: `Error ${response.status}: ${response.statusText}` });
    }
  } catch (error) {
    res.render('weather', { error: 'Unable to fetch weather data' });
  }
}

module.exports = {
  getWeatherData,
};
