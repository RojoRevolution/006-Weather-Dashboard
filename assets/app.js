// View Activity 10 as a resource


$(document).ready(function () {
    // ========================
    // API Call Section
    var APIKey = "27c1cb710c54f9c6192d48c06bd4dc82";
    var city = "Austin"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
    })


    // ========================
    var $searchInput = $("#search-box");
    var $searchBtn = $("#search-button");
    var history = $("#history")


    // ========================
    //event listener for search button
    $searchBtn.on("click", function (event) {
        event.preventDefault();

        var historyLI = /*html*/`<li class="list-group-item">${$searchInput.val()}</li>`
        history.append(historyLI)
    })

})
