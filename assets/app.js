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
        // Calls Current Weather API 
        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response);

            // Vars grab the needed responses from API
            var $city = response.name;
            var $temperature = response.main.temp;
            var $currentTempRounded = Math.round($temperature) + "° F";
            var $humidity = response.main.humidity;
            var $wind = response.wind.speed + " MPH";
            // Lattitude Longitude needed for One Call API as it does not take City as a parameter for some bogus reason
            var $latitude = response.coord.lat;
            var $longitude = response.coord.lon;

            //Variables for One Call API Parameters
            var $exclude = "minutely,hourly,daily,alerts"
            var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + $latitude + "&lon=" + $longitude + "&exclude=" + $exclude + "&appid=" + APIKey;

            // Calls One Call API    
            function oneCallAPI() {
                $.ajax({
                    url: oneCallURL,
                    method: "GET"
                }).then(function (response) {
                    // console.log(response)
                    //variable grabs UV index from One Call API
                    var responseUV = response.current.uvi;
                    // console.log(responseUV)


                    //Renders All Current Data Content to the page
                    var resultsDiv = /*html*/`
                    <div class="card">
                        <div class="card-body p5">
                            <h2 id="city-name" class="card-title mb-3">${$city}</h2>
                            <p id="city-temp" class="card-text">Temperature: ${$currentTempRounded}</p>
                            <p id="city-humidity" class="card-text">Humidity: ${$humidity} </p>
                            <p id="city-wind" class="card-text">Wind Speed: ${$wind}</p>
                            <p id="city-uv" class="card-text">UV Index: <span 
                                class="badge text-light"> ${responseUV}</span></p>
                        </div>
                    </div>`
                    // Empty clears the div before appending so content does not stack infinitely
                    $("#city-info").empty(resultsDiv)
                    $("#city-info").append(resultsDiv)

                    // If statement changes the BG Color of the UV Index badge based on the response
                    if (responseUV <= 2) {
                        $(".badge").addClass("bg-success")
                    } else if (responseUV >= 3 && responseUV <= 5) {
                        $(".badge").addClass("moderate text-dark")
                    } else if (responseUV >= 6 && responseUV <= 7) {
                        $(".badge").addClass("high")
                    } else if (responseUV >= 8 && responseUV <= 10) {
                        $(".badge").addClass("bg-danger")
                    } else {
                        $(".badge").addClass("extreme")
                    }
                })

            }

            oneCallAPI()
            // console.log(uvIndex)

            renderForcast($latitude, $longitude)

        })
    }

    function renderForcast(lat, long) {
        var $exclude = "current,minutely,hourly,alerts"
        var oneCallURL2 = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + long + "&exclude=" + $exclude + "&appid=" + APIKey;

        $.ajax({
            url: oneCallURL2,
            method: "GET"
        }).then(function (response) {
            console.log(response)

            // Adds H3 and the Row div before running rest of content through a loop
            var forcastContainers = /*html*/`
            <h3>Five Day Forcast</h3>
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
    function renderFiveDays(responseCeption) {
        for (var i = 0; i <= 5; i++) {
            //Date conversion from Unix to final output 
            var $dailyDate = responseCeption.daily[i].dt * 1000
            var $dateConvert = new Date($dailyDate).toLocaleDateString("en-US")
            var $dateFormatBeg = $dateConvert.substr(0, 5);
            var $dateFormatEnd = $dateConvert.substr(7);
            var $formatDate = $dateFormatBeg + $dateFormatEnd

            // Grabs icon file name and appends it to complete URL
            var $icon = responseCeption.daily[i].weather[0].icon
            var $iconURL = "http://openweathermap.org/img/wn/" + $icon + "@2x.png"
            //grabs daily high and rounds it
            var $dailyHigh = responseCeption.daily[i].temp.max;
            var $dailyHighRound = Math.round($dailyHigh);
            //grabs humidity
            var $humidity = responseCeption.daily[i].humidity

            var forcastContent = /*html*/`
                <div class="col-lg-2 justify-content-between">
                    <div class="container bg-primary p-3 my-3 text-light rounded-3 text-center">
                        <h3 class="mb-4 date">${$formatDate}</h3>
                        <img src="${$iconURL}" alt="Forcasted Weather Icon">
                        <p>Temp: ${$dailyHighRound} F</p>
                        <p>Humidity: ${$humidity}%</p>
                    </div>
                </div>`

            // $(".forcast").empty(forcastContent)
            $(".forcastRow").append(forcastContent)
        }

    }



    //=================================
    //Calls the Five Day Forcast Response from API
    // function renderForcast() {
    //     var forcastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + $city + "&cnt=40&appid=" + APIKey;

    //     $.ajax({
    //         url: forcastQueryURL,
    //         method: "GET"
    //     }).then(function (response) {
    //         // console.log(response)

    //         // Adds H3 and the Row div before running rest of content through a loop
    //         var forcastContainers = /*html*/`
    //         <h3>Five Day Forcast</h3>
    //         <div class="row forcastRow"></div>`
    //         //Empty clears div of content before rerendering
    //         $(".forcast").empty(forcastContainers)
    //         $(".forcast").append(forcastContainers)

    //         // Calls the render function
    //         renderFiveDays(response)
    //     })
    // }

    // //=================================
    // // Renders the 5 Day forecast cards using a loop,
    // function renderFiveDays(response) {
    //     for (var i = 7; i <= 40; i += 8) {
    //         //Grabs the date response
    //         var $responseDate = response.list[i].dt_txt;
    //         //Removes the time from the date response
    //         var $rmvHour = $responseDate.substr(0, 10);
    //         //Removes the year from the front of the response, the adds -21 at the end -- this is not good code for the long run but it works for now with the API I am using
    //         var $date = $rmvHour.substr(5, 9) + "-21"

    //         // ----- NEED TO FIGURE OUT ICON
    //         // var $responseIcon = response.list[8].weather

    //         //Grabs the maximum temp from the 3:00pm time slot - I did not find a free API that gave me the max temp
    //         var $responseMaxTemp = response.list[i].main.temp_max
    //         //Rounds the max temp so we do not display a decimal
    //         var $max_temp = Math.round($responseMaxTemp)
    //         // console.log($max_temp)

    //         //Grabs the humidity response
    //         var $responseHumid = response.list[i].main.humidity
    //         // console.log($responseHumid)

    //         var forcastContent = /*html*/`
    //             <div class="col-lg-2 justify-content-between">
    //                 <div class="container bg-primary p-3 my-3 text-light rounded-3">
    //                     <h3 class="mb-4 date">${$date}</h3>
    //                     <p>Icon</p>
    //                     <p>Temp: ${$max_temp} F</p>
    //                     <p>Humidity: ${$responseHumid}%</p>
    //                 </div>
    //             </div>`

    //         // $(".forcast").empty(forcastContent)
    //         $(".forcastRow").append(forcastContent)
    //     }

    // }

    // ========================
    //event listener for search button
    $searchBtn.on("click", function (event) {
        event.preventDefault();
        $city = $searchInput.val().trim();
        var historyLI = /*html*/`<li id="$city"class="list-group-item search-li">${$searchInput.val()}</li>`
        $history.append(historyLI)


        localStorage.setItem(`History`, $city);




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

