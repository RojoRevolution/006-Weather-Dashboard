$(document).ready(function () {

    var APIKey = "27c1cb710c54f9c6192d48c06bd4dc82";
    var city = "Austin"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
    })

})
