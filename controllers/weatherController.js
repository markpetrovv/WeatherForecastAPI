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
  } else { // 
    console.error('Invalid location:', location);
    return;
  }


  const response = await fetch(queryUrl);
  const data = await response.json();


  if (response.ok) {
    const temp = data.main.temp;
    const city = data.name;
    const country = data.sys.country;
    console.log(`The temperature in ${city}, ${country} is ${temp}°C`);
  } else {
    console.error(`Error ${response.status}: ${response.statusText}`);
  }
}


const location = process.argv[2];


getWeatherData(location);
