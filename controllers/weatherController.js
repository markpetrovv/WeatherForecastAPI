const axios = require('axios');

const apiKey = '2b0178ed403a29a18c24969970737398';
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';

async function getWeatherData(location) {
  let queryUrl;
  if (isNaN(location)) {
    queryUrl = `${baseUrl}?q=${location}&appid=${apiKey}&units=metric`;
  } else if (location.length === 5) {
    queryUrl = `${baseUrl}?zip=${location}&appid=${apiKey}&units=metric`;
  } else if (location.includes(',')) {
    const [lat, lon] = location.split(',');
    queryUrl = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    throw new Error('Invalid location');
  }

  console.log(`Fetching weather data from URL: ${queryUrl}`);

  try {
    const response = await axios.get(queryUrl);
    if (response.status === 200) {
      const data = response.data;
      const temp = data.main.temp;
      const city = data.name;
      const country = data.sys.country;
      return { temp, city, country };
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Unable to fetch weather data');
  }
}


module.exports = {
  getWeatherData,
};