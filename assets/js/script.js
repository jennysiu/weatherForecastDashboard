// assign global variables
// my API key
const APIKey = "e8de3fe2e3c9033c7998ce66840fa106";
// API compulsory parameter
let limit = 1;

// function to fetch weather data 
function fetchWeatherData(cityName) {
  // retrieve user search - city
  // let cityName = $("#search-input").val();
  
  // Geocoding API - converts city names into coordinates
  const geoAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=${limit}&appid=${APIKey}`

  // GEOCODING API DATA FETCH
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

      // WEATHER API DATA FETCH
      const weatherQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${APIKey}&units=metric`
      
      fetch(weatherQueryUrl)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        console.log(data)
        // create array of weather data for 6 days (includes current day)
        let weatherDataArray = [];

          // for loop to iterate for today and 5 days forecast
          for (let i = 0; i < 6; i++) {
            let dailyWeatherData = {
              // city name
              cityName: data.city.name,
              
              // date (converts timestamp into date format using dayjs)
              date: dayjs.unix(data.list[i].dt).format("DD MMMM YYYY"),
              
              // main weather 
              mainWeather: data.list[i].weather[0].main,
              temperature: data.list[i].main.temp,
              feelsLike: data.list[i].main.feels_like,
              humidity: data.list[i].main.humidity,
              windSpeed: data.list[i].wind.speed,
              weatherDescription: data.list[i].weather[0].description
            }

            // push daily weather data into weatherDataArray
            weatherDataArray.push(dailyWeatherData);
          }
          // test weatherDataArray is there
          console.log(weatherDataArray);

          // CURRENT DATE SECTION
          let currentDateData = weatherDataArray[0];
          console.log(currentDateData)
          $("#currentCity").text(currentDateData.cityName);
          $("#currentDate").text(currentDateData.date);
          $(".icon").attr("id", currentDateData.mainWeather);
          $(".temp").text(`Temperature: ${currentDateData.temperature} °C (feels like ${currentDateData.feelsLike} °C)`);
          $(".wind").text(`Wind speed: ${currentDateData.windSpeed} m/s`);
          $(".humidity").text(`Humidity: ${currentDateData.humidity} g.m-3`);
          $(".weatherDescription").text(`${currentDateData.weatherDescription}`);

          

          return weatherDataArray;
      });
    });
}

// Front page: London weather
function londonWeather() {
  let cityName = "London";
  fetchWeatherData(cityName);
    
  // console.log(weatherDataArray);
}

londonWeather();

  // retrieve user search - city
  // let cityName = $("#search-input").val();

// user search button 
$(".search-button").on("click", function(e) {
  e.preventDefault();

  // retrieve user search - city
  let cityName = $("#search-input").val();
  fetchWeatherData();
  
});



// console.log(weatherDataArray);

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

