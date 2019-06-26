// init project
const express = require('express');
const fetch = require('node-fetch');

// Foursquare API Info
const clientId = process.env.FSQUARE_ID;
const clientSecret = process.env.FSQUARE_SECRET;
// APIXU Info
const apiKey = process.env.APIXU_APIKEY;
const forecastURL = process.env.APIXU_FORECAST_URL;
// explore venue API endpoint:
const url = 'https://api.foursquare.com/v2/venues/explore?near=';


async function getVenues(city) {
  const urlToFetch = ( 
    url + city +'&limit=10' + '&client_id=' + clientId + 
    '&client_secret=' + clientSecret + '&v=20181114'
  );  
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
      return venues;
    } else {
      throw new Error('Request Failed!');
    }   
  } catch (error) {
    console.log(error);
  }
}


const getForecast = async (city) => {
  const urlToFetch = forecastURL + apiKey + '&q=' + city + '&days=5&hour=12';
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const days = jsonResponse.forecast.forecastday;
      return days;
    } else {
      throw new Error('Request Failed!');
    }
  } catch (error) {
    console.log(error);
  }
}

async function getDaysVenues(city){
  const venues = await getVenues(city);
  const days = await getForecast(city);
  return {venues: venues, days: days};
}


const app = express();
app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.route('/api/destination')
.get((req, res) => {
  const city = req.query.place;
  
  getDaysVenues(city)
  .then(daysVenues => {
    return res.json(daysVenues);
  })
  .catch(err => {
    console.log(err);
  })
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
