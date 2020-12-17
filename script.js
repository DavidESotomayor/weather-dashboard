$( document ).ready(function() {
var apiKey = 'f8c674028f7d3e9fc14527ccfada55ec'
var forecastWeatherAPI = 'http://api.openweathermap.org/data/2.5/forecast?q=Chicago&units=imperial&appid=' + apiKey;
var currentWeatherAPI = 'http://api.openweathermap.org/data/2.5/weather?q=Chicago&units=imperial&appid=' + apiKey;
var uvIndex = 'http://api.openweathermap.org/data/2.5/uvi?lat=41.85&lon=-87.65&appid=' + apiKey;

// returns object containing 5 day forecast
$.ajax({
    url: forecastWeatherAPI,
    method: "GET"
    })
    .then(function(response) {
        console.log(forecastWeatherAPI)
        console.log(response) // object returned
        console.log(response.list[2].dt_txt) // date returned
        console.log(response.list[2].weather[0].icon) // icon returned
        console.log(response.list[2].main.temp) // temperature returned
        console.log(response.list[2].main.humidity) // humidity returned
    })

// returns object containing current day forecast
$.ajax({
    url: currentWeatherAPI,
    method: "GET"
    })
    .then(function(response) {
        console.log(currentWeatherAPI)
        console.log(response) // object returned
        console.log(response.name) // name of city returned
        console.log(response.weather[0].icon) // icon returned
        console.log(response.main.temp) // temperature returned
        console.log(response.main.humidity) // humidity returned
        console.log(response.wind.speed) // wind speed returned
    })

// returns object containing current day UV index
$.ajax({
    url: uvIndex,
    method: "GET"
    })
    .then(function(response) {
        console.log(uvIndex)
        console.log(response) // object returned
        console.log(response.value) // UV index returned
    })
})