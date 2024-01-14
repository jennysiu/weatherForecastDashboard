//  TODO: fix timezome conversion/dates also not displaying ocrrectly
//  todo: add icons 
//!  todo: search history buttons
// todo: error handling for city names
// ! todo: add search array to local storage

// assign global variables
// my API key
const APIKey = "e8de3fe2e3c9033c7998ce66840fa106";
// API compulsory parameter
let limit = 1;

let recentSearchesArray = [];

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
          // console.log(weatherDataArray);

          // CURRENT DATE SECTION
          let currentDateData = weatherDataArray[0];
          // console.log(currentDateData)
          // empty existing data
          // $(".jumbotron").empty();

          $("#currentCity").text(currentDateData.cityName);
          $("#currentDate").text(`${currentDateData.date} (Today)`);
          $(".weatherIcon").attr("id", currentDateData.mainWeather);
          $(".current-temp").text(`Temperature: ${currentDateData.temperature} °C (feels like ${currentDateData.feelsLike} °C)`);
          $(".current-wind").text(`Wind speed: ${currentDateData.windSpeed} m/s`);
          $(".current-humidity").text(`Humidity: ${currentDateData.humidity} g.m-3`);
          $(".current-weatherDescription").text(`${currentDateData.weatherDescription}`);
          
          // 5 DAY FORECAST
          // empty existing data
          $(".card .card-body").empty();
          for (let i = 1; i < weatherDataArray.length; i++) {
            let cardSelector = `#weatherCard-${i}`
            // construct cards
            let cardContent = `
              <p class="card-text">${weatherDataArray[i].date}</p>
              <img id="${weatherDataArray[i].mainWeather}">
              <ul class="forecastWeather">
                <li class="temp">Temp: ${weatherDataArray[i].temperature} °C</li>
                <li class="wind">Wind: ${weatherDataArray[i].windSpeed} m/s</li>
                <li class="humidity">Humidity: ${weatherDataArray[i].humidity}%</li>
              </ul>
            `
            // update card with new content
            $(cardSelector).find(".card-body").html(cardContent);
          }          
          
          
      });
    });
}

// Front page: London weather
function londonWeather() {
  let cityName = "London";
  fetchWeatherData(cityName);
}
londonWeather();

  // retrieve user search - city
  // let cityName = $("#search-input").val();

// user search button 
$(".search-button").on("click", function(e) {
  e.preventDefault();

  // retrieve user search - city
  let cityName = $("#search-input").val();
  // run API fetch
  if (cityName) {
    fetchWeatherData(cityName)

      // RECENT SEARCHES
      if (!recentSearchesArray.includes(cityName) && recentSearchesArray.length < 5) {
        recentSearchesArray.push(cityName);
        // save to local storage
        localStorage.setItem("storedRecentSearches", JSON.stringify(recentSearchesArray));

        generateRecentSearchButtons();
        
        
      } else if (recentSearchesArray.length >= 5) {
        // deletes item in add new city to end of array
        recentSearchesArray.shift();
        console.log(recentSearchesArray);
        recentSearchesArray.push(cityName);
        // save to local storage
        localStorage.setItem("storedRecentSearches", JSON.stringify(recentSearchesArray));

        generateRecentSearchButtons();
      }
      // clear search bar 
      $("#search-input").val("");
  } 
});

function generateRecentSearchButtons() {
  // empty existing buttons
  $("#history").empty();
  // get recent searches array from local storage
  let storedRecentSearches = JSON.parse(localStorage.getItem("storedRecentSearches"));
  console.log(storedRecentSearches);
    for (let i = 0; i < storedRecentSearches.length; i ++) {   
      let recentSearch = $("<button>")
      .addClass(`search-${i + 1}`)
      .text(storedRecentSearches[i]);
      $("#history").append(recentSearch);
      console.log(storedRecentSearches)
    }
}
generateRecentSearchButtons()

// event delegation click function to query recent search buttons 
$("#history").on("click", "button", function(event) {
  cityName = $(event.target).text();
  fetchWeatherData(cityName)
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

