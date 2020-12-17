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
        var forecastDateFull = (response.list[2].dt_txt) // date returned
        var forecastIcon = (response.list[2].weather[0].icon) // icon returned
        var forecastTemp = (response.list[2].main.temp) // temperature returned
        var forecastHumid = (response.list[2].main.humidity) // humidity returned
        var formatDate = new Date(forecastDateFull)
        console.log(formatDate.toDateString())
        var forecastDate = formatDate.toDateString()
        $(".forecastDate").text(forecastDate)
        $(".forecastIcon").attr("src", "http://openweathermap.org/img/w/" + forecastIcon + ".png");
        $(".forecastTemp").text('Temperature: ' + forecastTemp)
        $(".forecastHumid").text('Humidity: ' + forecastHumid)

    })

// returns object containing current day forecast
$.ajax({
    url: currentWeatherAPI,
    method: "GET"
    })
    .then(function(response) {
        console.log(currentWeatherAPI)
        console.log(response) // object returned
        var cityData = (response.name) // name of city returned
        var iconData = (response.weather[0].icon) // icon returned
        var tempData = (response.main.temp) // temperature returned
        var humidData = (response.main.humidity) // humidity returned
        var windData = (response.wind.speed) // wind speed returned
        $("#currentIcon").attr("src", "http://openweathermap.org/img/w/" + iconData + ".png");
        $("#currentCity").text('City: ' + cityData)
        $("#currentTemp").text('Temperature: ' + tempData)
        $("#currentHumid").text('Humidity: ' + humidData)
        $("#currentWind").text('Wind: ' + windData)
        

    })

// returns object containing current day UV index
$.ajax({
    url: uvIndex,
    method: "GET"
    })
    .then(function(response) {
        console.log(uvIndex)
        console.log(response) // object returned
        var uvData = (response.value) // UV index returned
        $("#currentUV").text('UV: ' + uvData)
    })
})