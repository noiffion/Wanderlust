$(function() {
  
  // Page Elements
  const $destination = $('#destination');
  const $container = $('.container');
  const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3")];
  const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3")];
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const createVenueHTML = (name, location, iconSource) => {
    return (
      `<h2>${name}</h2>
      <img class="venueimage" src="${iconSource}"/>
      <h3>Address:</h3>
      <p>${location.address}</p>
      <p>${location.city}</p>
      <p>${location.country}</p>`
    );
  }

  const createWeatherHTML = (currentDay) => {
    return (
      `<h2> High: ${currentDay.day.maxtemp_c} °C</h2>
      <h2> Low: ${currentDay.day.mintemp_c} °C</h2>
      <img src="https://${currentDay.day.condition.icon}" class="weathericon" />
      <h2>${weekDays[(new Date(currentDay.date)).getDay()]}</h2>`
    );
  }
  
  // Render functions
  const renderVenues = (venues) => {
    // This is an array of the <div>s in index.html where you will render the 
    // information returned in the response from the Foursquare API:
    $venueDivs.forEach(($venue, index) => {
      const venue = venues[index];
      const venueIcon = venue.categories[0].icon;
      const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
      let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
      $venue.append(venueContent);
    });
    $destination.append(`<h2>${venues[0].location.city}</h2>`); 
  }

  const renderForecast = (days) => {
    $weatherDivs.forEach(($day, index) => {
      const currentDay = days[index];
      let weatherContent = createWeatherHTML(currentDay);
      $day.append(weatherContent);
    });
  }

  const executeSearch = (daysVenues) => {
    $venueDivs.forEach(venue => venue.empty());
    $weatherDivs.forEach(day => day.empty());
    $destination.empty();
    $container.css("visibility", "visible");
    renderVenues(daysVenues.venues);
    renderForecast(daysVenues.days);
    return false;
  }
  
  $('#cityForm').submit(function(e) {
    e.preventDefault();
    const city = $('#inputCity').val();
    $.ajax({
       url: `/api/destination?place=${city}`,
       type: 'get',
       success: (daysVenues) => {
         executeSearch(daysVenues);
       }
     }); 
  });
  
});
