const axios = require('axios');

const apiKey = '2b0178ed403a29a18c24969970737398';
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';

async function getWeatherData(req, res) {
  const location = req.query.location;

  let queryUrl;
  if (isNaN(location)) {
    queryUrl = `${baseUrl}?q=${location}&appid=${apiKey}&units=metric`;
  } else if (location.length === 5) {
    queryUrl = `${baseUrl}?zip=${location}&appid=${apiKey}&units=metric`;
  } else if (location.includes(',')) {
    const [lat, lon] = location.split(',');
    queryUrl = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    return res.render('weather', { error: 'Invalid location' });
  }

  try {
    const response = await axios.get(queryUrl);
    if (response.status === 200) {
      const data = response.data;
      const temp = data.main.temp;
      const city = data.name;
      const country = data.sys.country;
      res.render('weather', { temp, city, country });
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