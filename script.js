$( document ).ready(function() {
var apiKey = 'f8c674028f7d3e9fc14527ccfada55ec'
var weatherAPI = 'http://api.openweathermap.org/data/2.5/forecast?q=Chicago&units=imperial&appid=' + apiKey;

$.ajax({
    url: weatherAPI,
    method: "GET"
    })
    .then(function(response) {
        console.log(weatherAPI)
        console.log(response)
    })
})