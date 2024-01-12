
// my API key
const APIKey = "e8de3fe2e3c9033c7998ce66840fa106";

// Geocoding API - converts city names into coordinates
let cityName = "London";
let limit = 1;
const geoAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=${limit}&appid=${APIKey}`

// geocoding API fetch
fetch(geoAPIURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {

    // geocoding data for city
    // console.log(data)

    // city latitude
    let cityLat = data[0].lat;
    // console.log(cityLat)

    // city longitude
    let cityLon = data[0].lon;
    // console.log(cityLon)

    // weather API fetch
    const weatherQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${APIKey}`

    fetch(weatherQueryUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data)

      // for loop to iterate for today and 5 days forecast
      for (let i = 0; i < 6; i++) {
      // city name
      let cityName = data.city.name
      console.log(cityName);

      // date
      let dateTimestamp = data.list[i].dt;
      let date = dayjs.unix(dateTimestamp).format("DD MMMM YYYY")
      console.log(date);

      // icon
      

      // temperature
      // **** FIND METRIC *****
      let temperature = data.list[i].main.temp;
      console.log(temperature);

      // humidity
      // **** FIND METRIC *****
      let humidity = data.list[i].main.humidity;
      console.log(humidity);

      // wind speed
      let windSpeed = data.list[i].wind.speed;
      console.log(windSpeed);
      }
    })

  });

// When a user views the current weather conditions for that city they are presented with:
  // The city name
  // The date
  // An icon representation of weather conditions
  // The temperature
  // The humidity
  // The wind speed

// When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
  // The date
  // An icon representation of weather conditions
  // The temperature
  // The humidity
  // When a user click on a city in the search history they are again presented with current and future conditions for that city