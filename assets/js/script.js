// ! TODO: fix timezome conversion/dates also not displaying correctly
// ! todo: add icons 
//!  todo: search history buttons
// todo: error handling for city names
// ! todo: add search array to local storage

// assign global variables
// my API key
const APIKey = "e8de3fe2e3c9033c7998ce66840fa106";
// API compulsory parameter
let limit = 1;

let recentSearchesArray = [];

// function to fetch current weather
function fetchCurrentWeatherData(cityName) {
  
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


      // FORECAST WEATHER API DATA FETCH
      const currentWeatherQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${APIKey}&units=metric`
      
      fetch(currentWeatherQueryUrl)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        console.log(data)

        $("#currentCity").text(data.name);
        $("#currentDate").text(`${dayjs.unix(data.dt).format("DD MMMM YYYY HH")} (Today)`);
        $(".weatherIcon").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        $(".current-temp").text(`Temperature: ${data.main.temp} °C (feels like ${data.main.feels_like} °C)`);
        
        $(".current-wind").text(`Wind speed: ${data.wind.speed} m/s`);
        $(".current-humidity").text(`Humidity: ${data.main.humidity} g.m-3`);
        $(".current-weatherDescription").text(`${data.weather[0].description}`);
      });
    });
}
  
// function to fetch forecast data 
function fetchForecastData(cityName) {
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


      // FORECAST WEATHER API DATA FETCH
      const weatherQueryUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${APIKey}&units=metric`
      
      fetch(weatherQueryUrl)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        console.log(data)
        // create array of weather data for 5 days 
        let weatherDataArray = [];

          // for loop to iterate for today and 5 days forecast 
          for (let i = 0; i < 40; i++) {
            let dailyWeatherData = {
              // city name
              cityName: data.city.name,
              
              // date (converts timestamp into date format using dayjs)
              date: dayjs.unix(data.list[i].dt).format("DD MMM YYYY"),
              
              // main weather data
              mainWeather: data.list[i].weather[0].main,
              maxTemp: data.list[i].main.temp_max,
              minTemp: data.list[i].main.temp_min,
              feelsLike: data.list[i].main.feels_like,
              humidity: data.list[i].main.humidity,
              windSpeed: data.list[i].wind.speed,
              weatherDescription: data.list[i].weather[0].description,
              weatherIcon: data.list[i].weather[0].icon
            }

            // push daily weather data into weatherDataArray
            weatherDataArray.push(dailyWeatherData);
          }

          // empty existing data on weather cards
          $(".card .card-body").empty();

          console.log(weatherDataArray);
          // loop to dynamically render forecast cards
          for (let i = 0; i < weatherDataArray.length; i = i + 8) {
            var card = $("<div></div>")
            .addClass("col-lg-2 card")
            .attr({
              "id": `weatherCard-${i}`, 
              "style":"width: 18rem;"
            });
            var cardBody = $("<div></div>")
            .addClass("card-body");

            var cardDate = $("<p></p>")
            .addClass("card-date")
            .text(`${weatherDataArray[i].date}`);

            var weatherIcon = $("<img></img>")
            .addClass("weather-icon")
            .attr("src", `https://openweathermap.org/img/wn/${weatherDataArray[i].weatherIcon}@2x.png`);

            var weatherUlEl = $("<ul></ul>")
            .addClass("forecastWeather");

            var maxTemp = $("<li></li>")
            .addClass("maxTemp")
            .text(`Max temp: ${weatherDataArray[i].maxTemp}°C`);

            var minTemp = $("<li></li>")
            .addClass("minTemp")
            .text(`Min temp: ${weatherDataArray[i].minTemp}°C`);

            var wind = $("<li></li>")
            .addClass("wind")
            .text(`Wind: ${weatherDataArray[i].windSpeed}m/s`);

            var humidity = $("<li></li>")
            .addClass("humidity")
            .text(`Humidity: ${weatherDataArray[i].humidity}g.m-3`);
        
            weatherUlEl.append(maxTemp);
            weatherUlEl.append(minTemp);
            weatherUlEl.append(wind);
            weatherUlEl.append(humidity);
            cardBody.append(cardDate);
            cardBody.append(weatherIcon);
            cardBody.append(weatherUlEl);
            card.append(cardBody);
            $(".weather-cards").append(card)
          }          
      });
    });
}

// Front page: London weather
function londonWeather() {
  let cityName = "London";
  fetchCurrentWeatherData(cityName);
  fetchForecastData(cityName);
  
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
    fetchCurrentWeatherData(cityName);
    fetchForecastData(cityName);

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
  // console.log(storedRecentSearches);
    for (let i = 0; i < storedRecentSearches.length; i ++) {   
      let recentSearch = $("<button>")
      .addClass(`search-${i + 1}`)
      .text(storedRecentSearches[i]);
      $("#history").append(recentSearch);
    }
}
generateRecentSearchButtons()

// event delegation click function to query recent search buttons 
$("#history").on("click", "button", function(event) {
  cityName = $(event.target).text();
  fetchCurrentWeatherData(cityName);
  fetchForecastData(cityName)
});
