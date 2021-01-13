$(document).ready(function () {
    // ========================
    var $searchInput = $("#search-box");
    var $searchBtn = $("#search-button");
    var $history = $("#history");


    // Variable holds the current city that is being searched
    var $city = "";

    // ========================
    // API Key
    var APIKey = "27c1cb710c54f9c6192d48c06bd4dc82";

    //=================================
    //Calls the Five Day Forcast Response from API
    function renderConditions() {
        var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + $city + "&appid=" + APIKey;

        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response);

            // Vars grab the needed responses from API
            var $city = response.name;
            var $temperature = response.main.temp + "° F"
            var $humidity = response.main.humidity;
            var $wind = response.wind.speed + " MPH";

            // Need to figure out the UV index
            // var = uvIndex: //UV index requires different API? https://openweathermap.org/api/uvi

            //Renders Content to the page
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
            //Empty clears the div before appending so content does not stack infinitely
            $("#city-info").empty(resultsDiv)
            $("#city-info").append(resultsDiv)
        })
    }

    //=================================
    //Calls the Five Day Forcast Response from API
    function renderForcast() {
        var forcastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + $city + "&cnt=40&appid=" + APIKey;

        $.ajax({
            url: forcastQueryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response)

            // Adds H3 and the Row div before running rest of content through a loop
            var forcastContainers = /*html*/`
            <h4>Five Day Forcast</h4>
            <div class="row forcastRow"></div>`
            //Empty clears div of content before rerendering
            $(".forcast").empty(forcastContainers)
            $(".forcast").append(forcastContainers)

            // Calls the render function
            renderFiveDays(response)
        })
    }

    //=================================
    // Renders the 5 Day forecast cards using a loop,
    function renderFiveDays(response) {
        for (var i = 7; i <= 40; i += 8) {
            //Grabs the date response
            var $responseDate = response.list[i].dt_txt;
            //Removes the time from the date response
            var $rmvHour = $responseDate.substr(0, 10);
            //Removes the year from the front of the response, the adds -21 at the end -- this is not good code for the long run but it works for now with the API I am using
            var $date = $rmvHour.substr(5, 9) + "-21"

            // ----- NEED TO FIGURE OUT ICON
            // var $responseIcon = response.list[8].weather

            //Grabs the maximum temp from the 3:00pm time slot - I did not find a free API that gave me the max temp
            var $responseMaxTemp = response.list[i].main.temp_max
            //Rounds the max temp so we do not display a decimal
            var $max_temp = Math.round($responseMaxTemp)
            // console.log($max_temp)

            //Grabs the humidity response
            var $responseHumid = response.list[i].main.humidity
            // console.log($responseHumid)

            var forcastContent = /*html*/`
                <div class="col-lg-2 justify-content-between">
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

    // Event listener for history buttons to rerender info 
    $("#history").on("click", "li", function (event) {
        event.preventDefault();
        $city = $(this).text().trim();
        console.log($city)
        renderConditions();
        renderForcast()
    })

})

