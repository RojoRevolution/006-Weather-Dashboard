$(document).ready(function () {

    // View Activity 10 as a resource

    // ========================
    var $searchInput = $("#search-box");
    var $searchBtn = $("#search-button");
    var $history = $("#history");


    // Need a variable that passes the $searchInput.val() from the click event
    var $city = "";

    // ========================
    // API Call Section
    var APIKey = "27c1cb710c54f9c6192d48c06bd4dc82";

    function renderConditions() {
        var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + $city + "&appid=" + APIKey;

        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var $city = response.name;
            var $temperature = response.main.temp + "° F"
            var $humidity = response.main.humidity;
            var $wind = response.wind.speed + " MPH";
            // var = uvIndex: //UV index requires different API? https://openweathermap.org/api/uvi
            var resultsDiv = /*html*/`
            <div class="card">
                <div class="card-body p5">
                    <h2 id="city-name" class="card-title mb-3">${$city}</h2>
                    <p id="city-temp" class="card-text">Temperature: ${$temperature}</p>
                    <p id="city-humidity" class="card-text">Humidity: ${$humidity} </p>
                    <p id="city-wind" class="card-text">Wind Speed: ${$wind}</p>
                    <p id="city-uv" class="card-text">UV Index: <span
                        class="badge bg-danger text-light">9.49</span></p>
                </div>
            </div>`
            $("#city-info").empty(resultsDiv)
            $("#city-info").append(resultsDiv)
        })
    }

    //call Forcast
    function renderForcast() {
        var forcastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + $city + "&cnt=40&appid=" + APIKey;

        $.ajax({
            url: forcastQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)

            var forcastContainers = /*html*/`
          <h3>Five Day Forcast</h3>
            <div class="row forcastRow"></div>`
            $(".forcast").empty(forcastContainers)
            $(".forcast").append(forcastContainers)


            renderFiveDays(response)
        })
    }

    function renderFiveDays(response) {
        for (var i = 7; i <= 40; i += 8) {
            //date
            var $responseDate = response.list[i].dt_txt;
            var $rmvHour = $responseDate.substr(0, 10);
            var $date = $rmvHour.substr(5, 9) + "-21"
            console.log($date)
            //Icon
            // var $responseIcon = response.list[8].weather
            //max temp
            var $responseMaxTemp = response.list[i].main.temp_max
            var $max_temp = Math.round($responseMaxTemp)
            console.log($max_temp)
            //humidity
            var $responseHumid = response.list[i].main.humidity
            console.log($responseHumid)

            var forcastContent = /*html*/`
                <div class="col-lg-2">
                    <div class="container bg-primary p-3 my-3 text-light rounded-3">
                        <h3 class="mb-4 date">${$date}</h3>
                        <p>Icon</p>
                        <p>Temp: ${$max_temp} F</p>
                        <p>Humidity: ${$responseHumid}%</p>
                    </div>
                </div>`

            // $(".forcast").empty(forcastContent)

            $(".forcastRow").append(forcastContent)
        }

    }




    // ========================
    //event listener for search button
    $searchBtn.on("click", function (event) {
        event.preventDefault();
        $city = $searchInput.val().trim();
        var historyLI = /*html*/`<li id="${$searchInput.val()}"class="list-group-item search-li">${$searchInput.val()}</li>`
        $("#history-header").removeClass("hide")
        $history.append(historyLI)
        renderConditions()
        $searchInput.val("");
        renderForcast()
    })

    // Event clicker for history buttons to rerender info ---- Unfinished
    $("#history").on("click", "li", function (event) {
        event.preventDefault();
        $city = $(this).text().trim();
        console.log($city)
        renderConditions();
        renderForcast()
    })

})

