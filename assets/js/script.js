

let getCityWeather = function(city) {
    // format the openweather api
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6cc51fec452ce9ba1156eafe5282e54f"

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

let displayCity = function() {
    
}