const express = require('express')
const exphbs = require('express-handlebars')
const app = express();
const axios = require('axios');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.engine('.hbs', exphbs.engine({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, 'views'));


app.get('/weather', async (req, res) => {
  const location = req.query.location;
  const apiKey = process.env.WEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather`;

  let queryUrl;
  if (isNaN(location)) { 
    queryUrl = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;
  } else if (location.length === 5) { 
    queryUrl = `${apiUrl}?zip=${location}&appid=${apiKey}&units=metric`;
  } else if (location.includes(',')) { 
    const [lat, lon] = location.split(',');
    queryUrl = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else { // 
    return res.render('weather', { error: 'Invalid location' });
  }

  try {
    const response = await axios(queryUrl);
    const data = await response.json();
    if (response.ok) {
      const temp = data.main.temp;
      const city = data.name;
      const country = data.sys.country;
      return res.render('weather', { temp, city, country });
    } else {
      return res.render('weather', { error: `Error ${response.status}: ${response.statusText}` });
    }
  } catch (error) {
    return res.render('weather', { error: 'Unable to fetch weather data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));