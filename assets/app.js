$(document).ready(function () {
    // ========================

    var $searchInput = $("#search-box");
    var $searchBtn = $("#search-button");
    var $history = $("#history");
    // Variable holds the current city that is being searched
    var $city = "";
    // Hold Search History City names
    var $historyArray = []
    // Calls the init function which checks local storage on load and appends existing history

    // ========================
    // API Key
    var APIKey = "27c1cb710c54f9c6192d48c06bd4dc82";
    init();

    //=================================
    //Calls the Five Day Forcast Response from API
    function renderConditions() {
        var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + $city + "&appid=" + APIKey;
        // Calls Current Weather API 
        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        }).then(function (response) {
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
            var $exclude = "minutely,hourly,alerts"
            var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + $latitude + "&lon=" + $longitude + "&exclude=" + $exclude + "&appid=" + APIKey;

            // Calls One Call API    
            function oneCallAPI() {
                $.ajax({
                    url: oneCallURL,
                    method: "GET"
                }).then(function (response) {
                    console.log(response)
                    //variable grabs UV index from One Call API
                    var responseUV = response.current.uvi;
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

                    // Begins the Render Forcast Section
                    var forcastContainers = /*html*/`
                     <h3>Five Day Forcast</h3>
                     <div class="row forcastRow"></div>`
                    //Empty clears div of content before rerendering
                    $(".forcast").empty(forcastContainers)
                    $(".forcast").append(forcastContainers)

                    // Calls the loop function for each day
                    renderFiveDays(response.daily)
                })
            }
            // Calls the Above function to get the UV index from a separate API
            oneCallAPI()
        })
    }

    //=================================
    // Uses above function to render the actual Five Day Forcast through a Loop
    function renderFiveDays(responseCeption) {
        for (var i = 0; i <= 5; i++) {
            //Date conversion from Unix to final output 
            var $dailyDate = responseCeption[i].dt * 1000
            var $dateConvert = new Date($dailyDate).toLocaleDateString("en-US")
            var $dateFormatBeg = $dateConvert.substr(0, 5);
            var $dateFormatEnd = $dateConvert.substr(7);
            var $formatDate = $dateFormatBeg + $dateFormatEnd

            // Grabs icon file name and appends it to complete URL
            var $icon = responseCeption[i].weather[0].icon
            var $iconURL = "https://openweathermap.org/img/wn/" + $icon + "@2x.png"
            //grabs daily high and rounds it
            var $dailyHigh = responseCeption[i].temp.max;
            var $dailyHighRound = Math.round($dailyHigh);
            //grabs humidity
            var $humidity = responseCeption[i].humidity
            // HTML items for the 5 day forcast
            var forcastContent = /*html*/`
                <div class="col-lg-2 justify-content-between column-width">
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

    // ========================
    // grabs local storage and rerenders the history list if storage is found
    function init() {
        // Get stored todos from localStorage in an array format
        var $storedHistory = JSON.parse(localStorage.getItem("History"));
        // If todos were retrieved from localStorage, update the todos array, otherwise end the function early
        if ($storedHistory !== null) {
            $historyArray = $storedHistory;
            $city = $historyArray[$historyArray.length - 1].trim()
            console.log($city)
        } else {
            return
        }

        // Render history list to the DOM
        renderHistoryOnLoad();
        renderConditions()
    }

    // ========================
    //Re-renders History list on the page on reload (part of init function)
    function renderHistoryOnLoad() {
        // for loop renders history based on the length and items in the history Array
        for (var i = 0; i < $historyArray.length; i++) {
            var $historyReRenderLi = /*html*/`<li id="$city"class="list-group-item search-li">${$historyArray[i]}</li>`
            $history.append($historyReRenderLi)
        }
    }

    // ========================
    //Stores history
    function storeHistory() {
        localStorage.setItem(`History`, JSON.stringify($historyArray));
    }

    // ========================
    //event listener for search button
    $searchBtn.on("click", function (event) {
        event.preventDefault();
        //sets the input value of the search box to a variable and trims it
        $city = $searchInput.val().trim();
        //creates list item HTML
        var $historyLI = /*html*/`<li id="$city"class="list-group-item search-li">${$city}</li>`
        //pushes city name to history array and appends the list item
        $historyArray.push($city)
        $history.append($historyLI)

        //Stores history, clears search box, renders current conditions and forcast 
        storeHistory();
        $searchInput.val("");
        renderConditions();
    })

    // ========================
    // Event listener for history buttons to reRender Weather Information when clicked
    $("#history").on("click", "li", function (event) {
        event.preventDefault();
        $city = $(this).text().trim();
        renderConditions();
    })

})

