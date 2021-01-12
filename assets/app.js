$(document).ready(function () {

    // View Activity 10 as a resource

    // ========================
    var $searchInput = $("#search-box");
    var $searchBtn = $("#search-button");
    var $history = $("#history");


    // Need a variable that passes the $searchInput.val() from the click event
    var $city = "";
    // if I prefil the variable it works 
    // var $city = "Denver"
    // console.log(typeof $city)





    // ========================
    // API Call Section
    var APIKey = "27c1cb710c54f9c6192d48c06bd4dc82";
    // var city = ""

    function showResults() {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + $city + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response);


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


    // ========================
    //event listener for search button
    $searchBtn.on("click", function (event) {
        event.preventDefault();
        $city = $searchInput.val().trim();
        var historyLI = /*html*/`<li id="${$searchInput.val()}"class="list-group-item search-li">${$searchInput.val()}</li>`
        $("#history-header").removeClass("hide")
        $history.append(historyLI)
        showResults()
        $searchInput.val("");
    })

    // Event clicker for history buttons to rerender info ---- Unfinished
    $("#history").on("click", "li", function (event) {
        event.preventDefault();
        $city = $(this).text().trim();
        console.log($city)
        showResults();
    })

})

