// Apologies code is quite WET as noticed quite late that I would need to use
// multiple fetch calls! and was too late to look into async/await which would have made 
// it much better

// ASSIGN GLOBAL VARIABLES
// my API key
const APIKey = "e8de3fe2e3c9033c7998ce66840fa106";
// API compulsory parameter
let limit = 1;
// retrieve any saved recent searches in local storage 
let recentSearchesArray = JSON.parse(localStorage.getItem("storedRecentSearches"));


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
        // console.log(data)

        $("#currentCity").text(data.name);
        $("#currentDate").text(`${dayjs.unix(data.dt).format("DD MMMM YYYY HH")} (Today)`);
        $(".weatherIcon").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        $(".current-temp").text(`Temperature: ${data.main.temp} °C (feels like ${data.main.feels_like} °C)`);
        
        $(".current-wind").text(`Wind speed: ${data.wind.speed} m/s`);
        $(".current-humidity").text(`Humidity: ${data.main.humidity} g.m-3`);
        $(".current-weatherDescription").text(`${data.weather[0].description}`);
      });
    })    
    .catch(function(error) {
      // console.error('There has been a problem with your fetch operation:', error);
      // Handle the error here
      invalidCityName();
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
        // console.log(data)
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
          $(".weather-cards").empty();

          // console.log(weatherDataArray);

          // loop to dynamically render forecast cards
          for (let i = 0; i < weatherDataArray.length; i = i + 8) {
            var card = $("<div></div>")
            .addClass("col-lg-2 card")
            .attr({
              "id": `weatherCard-${i}`, 
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
    })
    .catch(function(error) {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// Front page: London weather
function londonWeather() {
  let cityName = "London";
  fetchCurrentWeatherData(cityName);
  fetchForecastData(cityName);
}
londonWeather();


// user search button 
$(".search-button").on("click", function(e) {
  e.preventDefault();

  // retrieve user search - city
  let cityName = $("#search-input").val();

  // Geocoding API - converts city names into coordinates
  const geoAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=${limit}&appid=${APIKey}`

  // GEOCODING API DATA FETCH
  fetch(geoAPIURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data)

      if (data.length > 0) {
        $(".error-message").empty();
        fetchCurrentWeatherData(cityName);
        fetchForecastData(cityName);
        
          // RECENT SEARCHES
          if (recentSearchesArray && !recentSearchesArray.includes(cityName) && recentSearchesArray.length < 5) {
            recentSearchesArray.push(cityName);
            // save to local storage
            localStorage.setItem("storedRecentSearches", JSON.stringify(recentSearchesArray));
            generateRecentSearchButtons();
          } else if (recentSearchesArray && recentSearchesArray.length >= 5) {
            // deletes item in add new city to end of array
            recentSearchesArray.shift();
            recentSearchesArray.push(cityName);
            // save to local storage
            localStorage.setItem("storedRecentSearches", JSON.stringify(recentSearchesArray));
            generateRecentSearchButtons();
          }
          // clear search bar 
          $("#search-input").val("");
      } else {
        invalidCityName()
      }
    })
    .catch(function(error) {
      console.log('There has been a problem with your fetch operation:', error);
      // show error message to user
      invalidCityName();
    });
});

function generateRecentSearchButtons() {
  // empty existing buttons
  $(".recent-search-buttons").empty();

  // get recent searches array from local storage
  let storedRecentSearches = JSON.parse(localStorage.getItem("storedRecentSearches"));
  
  if (storedRecentSearches) {
    
  // console.log(storedRecentSearches);
    for (let i = 0; i < storedRecentSearches.length; i ++) {   
      let recentSearch = $("<button>")
      .addClass(`search-${i + 1}`)
      .text(storedRecentSearches[i]);
      $(".recent-search-buttons").append(recentSearch);
    }
  }
}
generateRecentSearchButtons()

// event delegation click function to query recent search buttons 
$(".recent-search-buttons").on("click", "button", function(event) {
  cityName = $(event.target).text();
  fetchCurrentWeatherData(cityName);
  fetchForecastData(cityName)
});

function invalidCityName() {
  // clear search bar
  $("#search-input").val("");

  // Clear existing
  $(".error-message").empty();
  
  let errorMessage = $("<p>")
  .addClass("error-message")
  .text("Please enter a valid city name.");

  $(".input-group").append(errorMessage);  
}

// clear recent searched buttons
$(".clear-search-button").on("click", function(e) {
  e.preventDefault();
  localStorage.clear();
  $(".recent-search-buttons").empty();
});

