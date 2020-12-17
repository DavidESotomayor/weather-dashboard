$(document).ready(function () {
    var apiKey = 'f8c674028f7d3e9fc14527ccfada55ec';
    var forecastWeatherAPI = (city = 'Chicago') => `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
    var currentWeatherAPI = (city = 'Chicago') => `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    var uvIndex = (lat = "41.85", lon = "-87.65") => `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    var forecastWeatherSection = $('<div/>', { "class": "row forecastRow" });

    function createDashboard() {
        var mainRow = $('<div/>', { "class": "row" });

        $('body').append([
            $('<nav/>', { "class": "navbar navbar-light bg-light navbarStyles" }).append(
                $('<span/>', { "class": "navbar-brand mb-0 h1" }).text("Weather Dashboard")),
            $('<div/>', { "class": "container" }).append(
                mainRow)]);

        mainRow.append([
            $('<div/>', { "class": "col-lg-3", id: "searchColumn" })
                .append([
                    $('<div/>', { "class": "row" }).append(
                        $('<h4/>').text("Search for a City:")),
                    $('<div/>', { "class": "row" }).append(
                        $('<form/>', { "class": "col form-inline my-2 my-lg-0" }).append([
                            $('<input>', { "class": "form-control w100 ", type: "search", placeholder: "Search", "aria-label": "Search", id: "userInput" }),
                            $('<p/>', { "class": "w100", id: "errorMessage" }).css("display", "none"),
                            $('<button/>', { "class": "w100 btn btn-outline-success my-2 my-sm-2", id: "submitBtn", type: "submit" }).text("Search"),
                            $('<button/>', { "class": "w100 btn btn-info", id: "clearBtn" }).text("Clear")])),
                    $('<div/>', { "class": "row recentSearch" })
                ]),
            $('<div/>', { "class": "col-lg-9" }).append([
                $('<div/>', { "class": "row weatherColumn" }).append(
                    $('<div/>', { "class": "card mainWeatherBlock" }).append(
                        $('<div/>', { "class": "card-body" }).append([
                            $('<div/>', { "class": "cityAndIcon" }).append([
                                $('<h4/>', { id: "currentCity", "class": "card-title" }),
                                $('<img>', { id: "currentIcon", src: "" })]),
                            $('<p/>', { id: "currentTemp", "class": "card-text" }),
                            $('<p/>', { id: "currentHumid", "class": "card-text" }),
                            $('<p/>', { id: "currentWind", "class": "card-text" }),
                            $('<div/>', { "class": "row" }).css("margin-left", "1px").append([
                                $('<p/>', { id: "currentUVText", "class": "card-text" }).text("UV:"),
                                $('<p/>', { id: "currentUVData" }).text('- - -')
                            ])
                        ])
                    )
                ),
                $('<div/>', { "class": "row weatherColumn" }).append($('<h3/>').text("5-Day Forecast:")),
                forecastWeatherSection
            ])
        ]);
    }
    function cityApi(city) {
        $.ajax({
            url: forecastWeatherAPI(city),
            method: "GET"
        }).then((response) => {
            $(".forecastColumn").remove()
            localStorage.setItem("latestHistory", city)
            forecastWeatherAPIResponse(response)
        }).catch(error => {
            $("#errorMessage").css({ "display": "inline-block", "color": "red" }).text(error.responseJSON.message)
        })


        // returns object containing current day forecast
        $.ajax({
            url: currentWeatherAPI(city),
            method: "GET"
        }).then(response => {
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            currentWeatherAPIResponse(response)
            return $.ajax({
                url: uvIndex(lat, lon),
                method: "GET"
            })
        }).then(uvIndexResponse)
    }

    function onLoad() {
        //LocalStorage
        /// Search History
        const getSearchHistory = (JSON.parse(localStorage.getItem("searchHistory")) || [])

        const searchElement = getSearchHistory.map(item => {
            return $('<h4/>', { "class": "w100 city" })
                .css({"background": "white", "margin": "4px 0px"})
                .text(item)
                .on("click", () => { 
                    cityApi(item)
                })
        })
        $(".recentSearch").append(searchElement)

        /// Latest History
        // latestHistory: "Seattle"
        const latestHistory = localStorage.getItem("latestHistory") //"Seattle" || null

        if (!latestHistory) {
            // returns object containing 5 day forecast
            $.ajax({
                url: forecastWeatherAPI(),
                method: "GET"
            }).then((response) => {
                $(".forecastColumn").remove()
                forecastWeatherAPIResponse(response)
            }).catch(error => {
                $("#errorMessage").css({ "display": "inline-block", "color": "red" }).text(error.responseJSON.message)
            })

            // returns object containing current day forecast
            $.ajax({
                url: currentWeatherAPI(),
                method: "GET"
            }).then(currentWeatherAPIResponse)

            // returns object containing current day UV index
            $.ajax({
                url: uvIndex(),
                method: "GET"
            }).then(uvIndexResponse)
        } else {
            cityApi(latestHistory)
        }

    }

    function createForecastCard({ forecastDate, forecastIcon, forecastTemp, forecastHumid }) {
        forecastWeatherSection.append(
            $('<div/>', { "class": "col-xl forecastColumn" }).append(
                $('<div/>', { "class": "card forecastDays" }).append(
                    $('<div/>', { "class": "card-body forecastCard" }).append([
                        $('<h5/>', { "class": "card-title forecastDate" }).text(`${forecastDate}`),
                        $('<img>', { "class": "forecastIcon", src: `http://openweathermap.org/img/w/${forecastIcon}.png` }),
                        $('<p/>', { "class": "card-text forecastTemp" }).text(`Temperature: ${forecastTemp} F`),
                        $('<p/>', { "class": "card-text forecastHumid" }).text(`Humidity: ${forecastHumid} %`)
                    ])
                )
            )
        )
    }

    const forecastWeatherAPIResponse = function (response) {
        response.list.forEach((list, index, arrayList) => {
            var count = (index + 1) * 7;
            if (count > arrayList.length) return;
            var forecastDateFull = arrayList[count].dt_txt;
            var forecastIcon = arrayList[count].weather[0].icon;
            var forecastTemp = arrayList[count].main.temp;
            var forecastHumid = arrayList[count].main.humidity;
            var formatDate = new Date(forecastDateFull)
            var forecastDate = formatDate.toDateString();
            createForecastCard({ forecastDate, forecastIcon, forecastTemp, forecastHumid })
        })
    }

    const currentWeatherAPIResponse = function (response) {
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
    }

    const uvIndexResponse = function (response) {
        var uvData = (response.value) // UV index returned
        if (uvData > 5) {
            $("#currentUVData").css("background", "red").text(uvData)
        } else if (uvData >= 3 && uvData <= 5) {
            $("#currentUVData").css("background", "yellow").text(uvData)
        } else {
            $("#currentUVData").css("background", "lightGreen").text(uvData)
        }
    }

    createDashboard()
    onLoad()

    $('#submitBtn').on('click', function (event) {
        event.preventDefault();
        const text = $('#userInput').val();
        if (!text) return 
        $("#errorMessage").css("display", "none")
        // returns object containing 5 day forecast
        $.ajax({
            url: forecastWeatherAPI(text),
            method: "GET"
        }).then((response) => {
            $(".forecastColumn").remove()
            $(".city").remove()
            $("#userInput").val('')
            const getSearchHistory = (JSON.parse(localStorage.getItem("searchHistory")) || [])
            const searchHistory = [text, ...getSearchHistory]
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
            localStorage.setItem("latestHistory", text)
            
            const searchElement = searchHistory.map(item => {
                return $('<h4/>', { "class": "w100 city" })
                .css({"background": "white", "margin": "4px 0px"})
                .text(item)
                .on("click", () => { 
                    cityApi(item)
                })
            })
            $(".recentSearch").append(searchElement)

            forecastWeatherAPIResponse(response)
        }).catch(error => {
            $("#userInput").val('')
            $("#errorMessage").css({ "display": "inline-block", "color": "red" }).text(error.responseJSON.message)
        })

        // returns object containing current day forecast
        $.ajax({
            url: currentWeatherAPI(text),
            method: "GET"
        }).then(response => {
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            currentWeatherAPIResponse(response)
            return $.ajax({
                url: uvIndex(lat, lon),
                method: "GET"
            })
        }).then(uvIndexResponse)

    })

    $('#clearBtn').on('click', function (event) {
        event.preventDefault();
        localStorage.removeItem("searchHistory")
        localStorage.removeItem("latestHistory")
        $(".city").remove()
        $("#userInput").val('')
        $("#errorMessage").css({ "display": "none"}).text('')
        console.log("clear")
    })
})