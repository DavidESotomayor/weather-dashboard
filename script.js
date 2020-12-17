$( document ).ready(function() {
var apiKey = 'f8c674028f7d3e9fc14527ccfada55ec'
var forecastWeatherAPI = 'http://api.openweathermap.org/data/2.5/forecast?q=Chicago&units=imperial&appid=' + apiKey;
var currentWeatherAPI = 'http://api.openweathermap.org/data/2.5/weather?q=Chicago&units=imperial&appid=' + apiKey;
var uvIndex = 'http://api.openweathermap.org/data/2.5/uvi?lat=41.85&lon=-87.65&appid=' + apiKey;
var forecastWeatherSection = $('<div/>', { "class": "row forecastRow"});




function createDashboard() {
    var mainRow = $('<div/>', { "class": "row"});

    $('body').append([
        $('<nav/>', { "class": "navbar navbar-light bg-light navbarStyles"}).append(
            $('<span/>', { "class": "navbar-brand mb-0 h1"}).text("Weather Dashboard")),
        $('<div/>', { "class": "container"}).append(
            mainRow)]);

            mainRow.append([
                $('<div/>', { "class": "col-lg-3", id: "searchColumn"})
                .append([
                    $('<div/>', { "class": "row"}).append(
                        $('<h4/>').text("Search for a City:")),
                    $('<div/>', { "class": "row"}).append(
                        $('<form/>', { "class": "form-inline my-2 my-lg-0"}).append([
                            $('<input>', { "class": "form-control mr-sm-2", type: "search", placeholder: "Search", "aria-label": "Search"}),
                            $('<button/>', { "class": "btn btn-outline-success my-2 my-sm-2"}).attr("type", "submit").text("Search"),
                            $('<button/>', { "class": "btn btn-info"}).text("Clear")])),
                    $('<div/>', { "class": "row recentSearch"}).append(
                        $('<h4/>').text("Chicago")),
                    $('<div/>', { "class": "row"}).append(
                        $('<h4/>').text("New York")),
                    $('<div/>', { "class": "row"}).append(
                        $('<h4/>').text("Miami")),
                    $('<div/>', { "class": "row"}).append(
                        $('<h4/>').text("Los Angeles"))]),
                $('<div/>', { "class": "col-lg-9"}).append([
                    $('<div/>', { "class": "row weatherColumn"}).append(
                        $('<div/>', { "class": "card mainWeatherBlock"}).append(
                            $('<div/>', { "class": "card-body"}).append([
                                $('<div/>', { "class": "cityAndIcon"}).append([
                                    $('<h4/>', { id: "currentCity", "class": "card-title"}),
                                    $('<img>', { id: "currentIcon", src: ""})]),
                                $('<p/>', { id: "currentTemp", "class": "card-text"}),
                                $('<p/>', { id: "currentHumid", "class": "card-text"}),
                                $('<p/>', { id: "currentWind", "class": "card-text"}),
                                $('<p/>', { id: "currentUV", "class": "card-text"})
                            ])
                        )
                    ),
                    $('<div/>', { "class": "row weatherColumn"}).append( $('<h3/>').text("5-Day Forecast:")),
                    forecastWeatherSection
                ])
            ]);
  }
createDashboard()

function createForecastCard() {
    forecastWeatherSection.append(
        $('<div/>', { "class": "col-xl forecastColumn"}).append(
            $('<div/>', { "class": "card forecastDays"}).append(
                $('<div/>', { "class": "card-body"}).append([
                    $('<h5/>', { "class": "card-title forecastDate"}).text("Date:"),
                    $('<img>', { "class": "forecastIcon", src: ""}),
                    $('<p/>', { "class": "card-text forecastTemp"}).text("Temp"),
                    $('<p/>', { "class": "card-text forecastHumid"}).text("Humidity")
                ])
            )
        )
    )
}


// returns object containing 5 day forecast
$.ajax({
    url: forecastWeatherAPI,
    method: "GET"
    })
    .then(function(response) {
        console.log(forecastWeatherAPI)
        console.log(response) // object returned
        // var forecastDateFull = (response.list[2].dt_txt) // date returned
        // var forecastIcon = (response.list[2].weather[0].icon) // icon returned
        // var forecastTemp = (response.list[2].main.temp) // temperature returned
        // var forecastHumid = (response.list[2].main.humidity) // humidity returned
        // var formatDate = new Date(forecastDateFull)
        // console.log(formatDate.toDateString())
        // var forecastDate = formatDate.toDateString()

        for ( var i = 0; i < 5; i++) {
            var count = (i + 1) * 6;
            console.log(response)
            var forecastDateFull = response.list[count].dt_txt;
            console.log(forecastDateFull)
            var forecastIcon = response.list[count].weather[0].icon;
            var forecastTemp = response.list[count].main.temp;
            var forecastHumid = response.list[count].main.humidity;
            var formatDate = new Date(forecastDateFull)
            console.log(formatDate)
            var forecastDate = formatDate.toDateString();
            createForecastCard()
            $(".forecastDate").text(forecastDate)
            $(".forecastIcon").attr("src", "http://openweathermap.org/img/w/" + forecastIcon + ".png");
            $(".forecastTemp").text('Temperature: ' + forecastTemp + ' F')
            $(".forecastHumid").text('Humidity: ' + forecastHumid + ' %')
        }



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
        var formatDate = new Date().toDateString();

        $("#currentIcon").attr("src", "http://openweathermap.org/img/w/" + iconData + ".png");
        $("#currentCity").text(cityData + ' ' + `(${formatDate})`)
        $("#currentTemp").text('Temperature: ' + tempData + ' F')
        $("#currentHumid").text('Humidity: ' + humidData + ' %')
        $("#currentWind").text('Wind: ' + windData + ' MPH')
        

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