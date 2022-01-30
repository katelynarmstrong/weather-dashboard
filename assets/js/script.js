// API key 
apiKey = "581ce92b85fceec3c210d9faa500eccb"

// variable reference
dailyWeatherEl = document.querySelector("#daily-weather")
searchBtn = document.querySelector("#search-btn")
cityNameInput = document.querySelector("#cityName")
forecastWeather = document.querySelector("#forecast-weather")
citySearchName = document.querySelector("#city-search-term")
cityList = document.querySelector("#city-list")
clearHistoryBtn = document.querySelector("#clear-history-list")

// city submission
var formSubmitHandler = function(event){
    event.preventDefault();
    var cityName = cityNameInput.value.trim();

    if (cityName) {
        getDailyWeather(cityName);
        getForecastWeather(cityName);
        saveSearch();
    } else {
        alert("You must enter a city name");
    }
}

// get daily weather info
var getDailyWeather = function(cityName){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=" + apiKey;

    fetch(apiUrl)
    then(function(response){
        if (response.ok){
            response.json().then(function(data){
            var currentDate = new Date(data.dt*1000).toLocaleDateString();
            citySearchName.textContent = cityName + " " + currentDate;
            weatherIcon = document.querySelector("#weather-icon")
            weatherIcon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
            temp = document.querySelector("#temperature");
            temp.innerHTML = "Temperature: " + k2f(data.main.temp) + "&#176;" + "F";
            humidity = document.querySelector("#humidity");
            humidity.innerHTML = "Humidity: " + data.wind.speed + " MPH";
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            
            let UVurl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            fetch(UVurl)
            .then(function(response) {
                response.json().then(function(data){
                    UVindex = document.querySelector("#UV-index")
                    UVindex.innerHTML = "UV-index: " + data[0].value
                    UVindex.className = "";
                    if (data[0].value , 4){
                        UVindex.classList.add("bg-success", "text-light", "p-1");
                    }
                    else if (data[0].value < 8){
                        UVindex.classList.add("bg-warning", "text-light", "p-1");
                    }
                    else {
                        UVindex.classList.add("bg-danger", "text-light", "p-1")
                    }
                })}

            )});
        }
        else{
            alert("City not recognized, try again");
        }
    })
    .catch(function(error){
        alert("Unable to connect to Weather.com");
    })
};

var getForecastWeather = function(cityName){
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            forecastWeather.innerHTML = "";
            for (var i=1; i < data.list.length; i+=8){
                var forecastEl = document.createElement("div");
                forecastEl.classList.add("weather-card");
                var dateForecast = document.createElement("h4");
                dateForecast.textContent = newDate (data.list[i].dt*1000).toLocaleDateString();
                var iconForecast = document.createElement("img");
                iconForecast.src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
                var temperatureForecast = document.createElement("p");
                temperatureForecast.innerHTML = "Temperature: " + k2f(data.list[i].main.temp) + "&#176;" + "F";
            }
        })
    })
}