const searchEl = document.querySelector("#search");
const cityInput = document.querySelector("#city-input");
const inputHistory = document.querySelector("#search-history");
const cityText = document.querySelector("#city");
const cityTemp = document.querySelector("#temperature");
const cityHumidity = document.querySelector("#humidity");
const cityWindSpd = document.querySelector("#wind-speed");
const cityUV = document.querySelector("#uv-index");
const uvColor = document.querySelector("#uv-color");
const weekDayForecast = document.querySelector("#week-forecast");
let historyIdCounter = 0;
const key = localStorage.key(length);

function getCityInput() {
    event.preventDefault();
    let city = cityInput.value.trim();

    // if cityInput is filled in then whatever the value is will be stored
    if (cityInput.value) {
        const key = "city" + historyIdCounter;
        localStorage.setItem(key, city);
        historyIdCounter++;
        cityInput.value = "";
        getCity(city);
        return
    }
    

    
};

// used only to get the long and lat of a city since oneCall does not take city names as parameters
function getCity(city) {
    searchHistoryGenerator(city);
    // format the openweather api
    const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=6cc51fec452ce9ba1156eafe5282e54f";
    
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    const cityLat = data.city.coord.lat;
                    const cityLon = data.city.coord.lon;
                    cityText.innerHTML = data.city.name + ", " + data.city.country + " | " + moment().format("MM/DD/YYYY").toString() + "<img src='https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png' />";
                    getCityWeather(cityLat, cityLon);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};

// using the information from the forecast api, we then call the oneCall api to give us all of our information
function getCityWeather(cityLat, cityLon) {
    fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,current&units=imperial&appid=6cc51fec452ce9ba1156eafe5282e54f"
    ).then(function(response) {
        return response.json();
    }).then(function(data) {
            displayWeather(data);
    });
};


function searchHistoryGenerator(city) {
    //after 12 elements, search history will start to delete old elements
    if (inputHistory.childElementCount > 13) {
        inputHistory.firstChild.remove();
    }
    const historyEl = document.createElement("div");
    historyEl.classList = "p-1 mt-2 card";

    const searchHistoryEl = document.createElement("span");
    searchHistoryEl.innerHTML = city;

    historyEl.appendChild(searchHistoryEl);
    inputHistory.appendChild(historyEl);
};

// used to target the search history div and get back the text inside the span of the div
function searchHistoryHandler(event) {
    let city = event.target.innerText;
    getCity(city);
};

function displayWeather(data) {
    cityTemp.innerHTML = data.daily[0].temp.day + " °F";
    cityHumidity.innerHTML = data.daily[0].humidity + "%";
    cityWindSpd.innerHTML = data.daily[0].wind_speed + " MPH";
    cityUV.innerHTML = data.daily[0].uvi;

    // depending on the uv index the color of it's background will change to give more information
    if (cityUV.innerHTML <= 2) {
        cityUV.classList = "bg-success p-2";
    } 
    if (cityUV.innerHTML > 2 && cityUV.innerHTML <= 5) {
        cityUV.classList = "bg-warning p-2";
    }
    if (cityUV.innerHTML > 5 && cityUV.innerHTML <= 7) {
        cityUV.classList = "caution p-2";
    }
    if (cityUV.innerHTML > 7 && cityUV.innerHTML <= 10) {
        cityUV.classList = "bg-danger p-2";
    }
    if (cityUV.innerHTML > 10) {
        cityUV.classList = "deathly p-2";
    }
    weekDayForecast.innerHTML = "";
    
    // loops through and creates the cards for the 5 day forecast
    for (var i = 1; i < 6; i++) {
        const forecastDate = moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
        const weekDayCardEl = document.createElement("div");
        weekDayCardEl.classList = "card bg-primary m-3 p-3";

        const weekDateEl = document.createElement("p");
        weekDateEl.innerHTML = forecastDate;
        weekDateEl.classList = "h5";
        weekDayCardEl.appendChild(weekDateEl);

        const cardImg = document.createElement("img");
        cardImg.setAttribute("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        weekDayCardEl.appendChild(cardImg);

        const cardTemp = document.createElement("p");
        cardTemp.innerHTML = "Temp: " + data.daily[i].temp.day + " °F";
        weekDayCardEl.appendChild(cardTemp);

        const cardHumidity = document.createElement("p");
        cardHumidity.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
        weekDayCardEl.appendChild(cardHumidity);
        weekDayForecast.appendChild(weekDayCardEl);
    }

};

// runs immediately when the page loads, checking if there is anything in localStorage or in the search history
function startup() {
    if (inputHistory.childElementCount === 0 && localStorage.getItem(key)) {
        getCity(localStorage.getItem(key));
    }
};

startup();
searchEl.addEventListener("submit", getCityInput);
inputHistory.addEventListener("click", searchHistoryHandler);