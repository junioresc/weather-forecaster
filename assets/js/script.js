const submitBtn = document.querySelector("#input-btn");
const cityInput = document.querySelector("#city-input");
const inputHistory = document.querySelector("#search-history");
const cityText = document.querySelector("#city");
const cityTemp = document.querySelector("#temperature");
const cityHumidity = document.querySelector("#humidity");
const cityWindSpd = document.querySelector("#wind-speed");
const cityUV = document.querySelector("#uv-index");
const weekDayForecast = document.querySelector("#week-forecast");


function getCityWeather(event) {
    event.preventDefault();
    let city = cityInput.value.trim();
    
    const historyEl = document.createElement("div");
    historyEl.classList = "list-item flex-row justify-space-between align-center";

    const searchHistoryEl = document.createElement("span");
    searchHistoryEl.classList = "flex-row align-center";
    searchHistoryEl.innerHTML = city;

    historyEl.appendChild(searchHistoryEl);
    inputHistory.appendChild(historyEl);
    // format the openweather api
    const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=6cc51fec452ce9ba1156eafe5282e54f";

    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data, city);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
}

function displayWeather(data, city) {
    cityText.innerHTML = data.city.name + "," + data.city.country + " | " + moment().format("MM/DD/YYYY").toString();
    cityTemp.innerHTML = data.list[2].main.temp + " °F";
    cityHumidity.innerHTML = data.list[2].main.humidity + "%";
    cityWindSpd.innerHTML = data.list[2].wind.speed + " MPH";
    const cityLat = data.city.coord.lat;
    const cityLon = data.city.coord.lon;
    fetch(
        "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=6cc51fec452ce9ba1156eafe5282e54f"
    ).then(function(response) {
        response.json().then(function(data) {
            cityUV.innerHTML = data[0].value;
        })
    });
    for (var i = 10; i < data.list.length; i = i + 8) {
        const forecastDate = moment(data.list[i].dt_txt).format("MM/DD/YYYY");
        weekDayCardEl = document.createElement("div");
        weekDayCardEl.classList = "card bg-primary";
        
    }

}

submitBtn.addEventListener("click", getCityWeather);