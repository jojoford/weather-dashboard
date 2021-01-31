const Cities = [];
// Current Date from moment.js 
const TodaysDate = moment().format('MM/DD/YYYY');

// Call the initial function
initial();

//  function will display the weather info from whatever is saved in local storage. 
function initial(){
    displayweatherinfo();
};

// display the weather information into the main-weather div.
function displayweatherinfo(){

// City  pulled from local storage
const City = localStorage.getItem('city');

//  URL for the Open Weather Map API that will change depending on the city input.
    const WeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + City + ",US&appid=3cc36befffcdde3fee1a588394a435ef";

    // The Ajax for the Open Weather API
    $.ajax({
    url: WeatherURL,
    method: "GET"
    }).then(function(response){
        // This constant will change the temperature from Kelvin to Fahrenheit.
        const tempF = (response.main.temp - 273.15) * 1.80 + 32;

        // This constant will get the value of the weather icon.
        const Weathericon = response.weather[0].icon;

        // This will get the name of the city from the Ajax response and the icon from the open weather map website. The date is retrieved from moment.js from the beginning of this doc.
        $('.city').html('<h3>' + response.name + ' (' + TodaysDate + ')' + '<img id="wIcon" src="https://openweathermap.org/img/wn/' + Weathericon + '@2x.png" />' + '</h3>');

        // This will get the temperature from the tempf equation to display in degrees Fahrenheit.
        $('.temp').html('Temperature: ' + tempF.toFixed(2) + ' &#8457');

        // The humidity is pulled from the Ajax response and inserted to the html.
        $('.humidity').text('Humidity: ' + response.main.humidity + '%');

        // The windspeed is pulled from the Ajax resposne and inserted to the html.
        $('.windspd').text('Wind Speed: ' + response.wind.speed + ' MPH');
        
        // The latitude and longitute coordinates are needed for the UV and 5 Day Forcast Ajax requests.
        const lati = response.coord.lat;
        const longi = response.coord.lon;
            
            // URL for the UV Request from the Open Weather Map. The longitute and latitude are needed.
            const UVurl = "https://api.openweathermap.org/data/2.5/uvi?appid=3cc36befffcdde3fee1a588394a435ef&lon=" + longi + "&lat=" + lati;
            // The Ajax for the UV request for the Open Weather API
            $.ajax({
            url: UVurl,
            method: "GET"
            }).then(function(response){
                const UVvalue = response.value;
                    // If the UV Value is lower than 3, the background of the of the UV Index Value will be Green to indicate favorable.
                    if (UVvalue < 3){
                        $('.uvindex').html('UV Index: ' + '<span class="border rounded" style="background-color: green; color: white">' + UVvalue + '</span>');
                    }
                    // If The UV Value is greater than 6, the background of the UV Index Value will be Red to indicate servere.
                    if (UVvalue > 6){
                        $('.uvindex').html('UV Index: ' + '<span class="border rounded" style="background-color: red; color: white">' + UVvalue + '</span>');
                    }
                    // If the UV Value is more than 3 but less than 6, the background of the UV Index Value will be Yellow to indicate moderate.
                    else {
                        $('.uvindex').html('UV Index: ' + '<span class="border rounded" style="background-color: yellow; color: black">' + UVvalue + '</span>');
                    }
            });

            // Thjis is the URL for the 5-day Forecast Request from the Open Weather Map. The latitude and longitude are needed.
            const forcastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lati + "&lon=" + longi + "&exclude=current,minutely,hourly,&appid=3cc36befffcdde3fee1a588394a435ef";
            
            // This will display the 5-Day Forecast Function
            renderfivedayforecast();

            // This is the function for the 5-Day Forecast
            function renderfivedayforecast() {
                // This will empty the 5-Day Forecast for the previous city so that only the current city will show.
                $("#forcastRow").empty();
            // This is the Ajax request for the 5-day Forecast.
            $.ajax({
                url: forcastURL,
                method: "GET"
            }).then(function(response){
                // This is the Row for the 5-Day Forcast that will display as cards.
                const cards = $("#forcastRow");

                // This is the for loop to loop through the array that is generated from the Ajax request response.
                for (let i = 1; i <= 5; i++){

                // The will get the time in UTC format from the Ajax Reponse.
                let UTCFormat = response.daily[i].dt;

                // This will use moment.js to convert the time from UTC to Standard Date Format.
                const ForDate = moment.unix(UTCFormat).format("MM/DD/YYYY");

                // This will store the weather icon from the Ajax response.
                const ForWIcon = response.daily[i].weather[0].icon;

                // This will convert the temperature from Kelvin to Fahrenheit.
                const FortempF = (((response.daily[i].feels_like.day - 273.15) * 1.80 + 32).toFixed(2));

                // This will get the humidity from teh Ajax response.
                const Forhumidity = (response.daily[i].humidity);

                // This will create a div for the cards for the 5-day Forecast.
                const cardDiv = $("<div>");
                cardDiv.addClass("card bg-primary col-sm-2");
                cardDiv.attr("id", "cards")

                // This will create a div for the Date.
                const dateDiv = $("<div>");
                dateDiv.attr('id', 'Date: ' + ForDate);
                dateDiv.html('<h6>' + ForDate + '</h6>');
                dateDiv.addClass('cardDate');
                // This will append the date to the card Div.
                cardDiv.append(dateDiv);

                // This will create a div for the weather icon.
                const iconDiv = $("<div>");
                iconDiv.attr('id', 'wIcon');
                iconDiv.html('<img id="wIcon" src="https://openweathermap.org/img/wn/' + ForWIcon + '@2x.png" />');
                iconDiv.addClass('cardIcon');

                // This will append the icon to the card Div.
                cardDiv.append(iconDiv);

                // This will create a div for the temperature.
                const tempDiv = $("<div>");
                tempDiv.attr('id', 'Temp:' + FortempF);
                tempDiv.html('Temp: ' + FortempF + ' &#8457')
                tempDiv.addClass('cardTemp mb-2');

                // This will append the temperature to the card Div.
                cardDiv.append(tempDiv);

                // This will create a div for the humidity.
                const humidityDiv = $("<div>");
                humidityDiv.attr('id', 'Humidity:' + Forhumidity);
                humidityDiv.html('Humidity: ' + Forhumidity + '%');
                humidityDiv.addClass('cardHumidity');

                // This will append the humidity to the card Div.
                cardDiv.append(humidityDiv);

                // The cards will be appeneded to the 5-Day Forcast Row.
                cards.append(cardDiv);
                
                };
            });};
        });
        
};

// This will signify that if the search button is clicked, the searched city will be displayed and saved to local storage.
$('.btn').on('click', function(event){
    event.preventDefault();
    const cityinput = $('#city-input').val().trim();
    localStorage.setItem('city', cityinput);
    Cities.push(cityinput);

    displayweatherinfo();
    
    // list  previously searched cities below search box
    const cityDiv = $('<div>');
    cityDiv.text(cityinput);
    cityDiv.addClass("card card-body");
    cityDiv.attr('id', 'cities');
    $("#city-div").prepend(cityDiv);
});

// This will display for previously searched cities if clicked.
$('#city-div').on('click', function(event){
    event.preventDefault();
    let citytarget = event.target;
    const cityinput = $(citytarget).text();
    localStorage.setItem('city', cityinput);
    Cities.push(cityinput);

    displayweatherinfo();

});
