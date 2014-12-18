//  You need to build a new function to incorporate a dynamic URL --> for the new variable location



$( document ).ready(function() {

  var llatitude = 42.3463503;
  var llongitude = -71.1626756;
  var gesture,
      classes,
      timer,
      weatherUpdate;
  var weatherCondition;
  var time = 0;
  var location = "Tokyo";
  var autoUpdate = false;
  var customSearch = false;
  var snowDay = false;
  var state = false;
  var updateFunc;
  var cityLoc, stateL;



  $('#customSeachBttn').click(function(){
    customSearch = !customSearch;
    if (customSearch) {
      $( this ).removeClass().addClass("selectedBttn");
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      $('#customSearch').css("height","375px")
                        .css("padding","25px 25px 25px 25px");
    } else {
      $( this ).removeClass().addClass("bttn");
      $("html, body").animate({ scrollTop: 0 }, 1000);
      $('#customSearch').css("height","0")
                        .css("padding","0 25px 0 25px");
    }
  });

  $('#today_id').click(function(){
    time = 0;
    checkWeather(time);
  });
 
  $('#tomorrow_id').click(function(){
    time = 1;
    checkWeather(time);
  });

  $('#weekend_id').click(function(){
    time = 2;
    checkWeather(time);
  });

  $('#cityGo').click(function(){
    cityLoc = document.locInput.wLoc.value;
    stateLoc = document.locInput.wwLoc.value;
    console.log(cityLoc + " " + stateLoc);
    checkWeatherLoc(time);
  });

  $('#autoUpdate').click(function(){
    autoUpdate = !autoUpdate;
    state = !state;
    if (autoUpdate) {
      console.log("Auto Update: LED State = " + state);
      updateFunc = setInterval( function () { checkWeather(time) }, timer);
      $( this ).removeClass().addClass("selectedBttn");
    } else {
      $( this ).removeClass().addClass("bttn");
      console.log("Manual Update: LED State = " + state);
      clearInterval(updateFunc);
    }
  });

  $('#snow').click(function(){
    var ip0 = "18.111.123.190";
    var pin;
    snowDay = !snowDay;
    state = !state;
    if (snowDay) {
      console.log("Snow day!!!");
      $( this ).removeClass().addClass("selectedBttn");
      $.ajax({
      url: "http://" + ip0 + "/mailbox/" + "S",
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
         console.log(response);
      }
      });
    } else {
      $( this ).removeClass().addClass("bttn");
      console.log("Not Snow Day : [");
    }
  });

  var query = function() {
      loadWeather(time);
      whatIsW(weatherCondition);
    };

  var queryLoc = function() {
    loadWeatherLoc(time, cityLoc, stateLoc);
    whatIsW(weatherCondition);
  };

  function updateInterval(minute) {
    var interval = minute * 60000;
    console.log("Time Interval set for " + minute + " minute(s)");
    return interval;
  }

  timer = updateInterval(0.5);

  function checkWeather(time) {
    var ip0 = "18.111.123.190";
    var pin;
    console.log("Update Weather");
    if (state) {
      pin = 1;
      console.log("LED ON");
    } else {
      pin = 0;
      console.log("LED OFF");
    }
    query();
    $( "#lampArm" ).removeClass().addClass("lampArm" + classes[0]);
    $( "#lampShade" ).removeClass().addClass("lampShade" + classes[1]);
    $.ajax({
      url: "http://" + ip0 + "/arduino/digital/13/" + pin,
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
         console.log(response);
      }
    });
    $.ajax({
      url: "http://" + ip0 + "/mailbox/" + classes[2],
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
         console.log(response);
      }
    });
  };

    function checkWeatherLoc(time) {
    var ip0 = "18.111.123.190";
    var pin;
    console.log("Update Weather");
    if (state) {
      pin = 1;
      console.log("LED ON");
    } else {
      pin = 0;
      console.log("LED OFF");
    }
    queryLoc();
    $( "#lampArm" ).removeClass().addClass("lampArm" + classes[0]);
    $( "#lampShade" ).removeClass().addClass("lampShade" + classes[1]);
    $.ajax({
      url: "http://" + ip0 + "/arduino/digital/13/" + pin,
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
         console.log(response);
      }
    });
    $.ajax({
      url: "http://" + ip0 + "/mailbox/" + classes[2],
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
         console.log(response);
      }
    });
  };

  // Geolocate Function

  $('#geoLocate').click(function(){
    getLocation();
    checkWeather(time);
  });

  var x = document.getElementById("geoResults");

  function getLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else { 
          x.innerHTML = "Geolocation is not supported by this browser.";
      }
  }

  function showPosition(position) {
      x.innerHTML = "Latitude: " + position.coords.latitude + 
      "<br>Longitude: " + position.coords.longitude;  
      console.log(position);
      llatitude = position.coords.latitude;
      llongitude = position.coords.longitude;
  }

  function showError(error) {
      switch(error.code) {
          case error.PERMISSION_DENIED:
              x.innerHTML = "User denied the request for Geolocation."
              break;
          case error.POSITION_UNAVAILABLE:
              x.innerHTML = "Location information is unavailable."
              break;
          case error.TIMEOUT:
              x.innerHTML = "The request to get user location timed out."
              break;
          case error.UNKNOWN_ERROR:
              x.innerHTML = "An unknown error occurred."
              break;
      }
  }

  // Update weather with respect to period {call}
  $('#weather').click(function(){
    checkWeather(time);
  });


  // Load weather conditions for selected time period

  function loadWeather(time) {
    var baseWeatherURL = "http://api.wunderground.com/api/9867e8006f7cddb7/forecast10day/conditions/q/"
    var weatherURL = baseWeatherURL + llatitude + "," + llongitude + ".json";
    $.ajax({
      url: weatherURL,
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
        console.log(weatherURL);
        console.log(response);
        //  Weather Query for Today
        if (time == 0) {
          weatherCondition = response.current_observation.weather;
          location = response.current_observation.display_location.full;
          weatherUpdate = "Today, the weather in " + location + " is " + weatherCondition;
          console.log(weatherUpdate);
        }
        //  Weather Query for Tomorrow
        else if (time == 1) {
          weatherCondition = response.forecast.simpleforecast.forecastday[1].conditions;
          location = response.current_observation.display_location.full;
          weatherUpdate = "Tomorrow, in " + location + " the weather will be " + weatherCondition;
          console.log(weatherUpdate);
        }
        //  Weather Query for Weekend
        else if (time == 2) {
          var Saturday,
              forecastDayW;
          var forecastLength = response.forecast.simpleforecast.forecastday.length;

          for(i=0; i < forecastLength; i++) {
            forecastDayW = response.forecast.simpleforecast.forecastday[i].date.weekday;
            if (forecastDayW == "Saturday") {
              weatherCondition = response.forecast.simpleforecast.forecastday[i].conditions;
              break;
            }
          }
          location = response.current_observation.display_location.full;
          weatherUpdate = "This weekend, in " + location + " the weather will be " + weatherCondition;
          console.log(weatherUpdate);
        };
        // Effect Dom element
        var x = document.getElementById("weatherResults");
        x.innerHTML = weatherUpdate;
      }
    });
  };

  // Load custom location
  function loadWeatherLoc(time, cityLocation, stateLocation) {
    var baseWeatherURL = "http://api.wunderground.com/api/9867e8006f7cddb7/forecast10day/conditions/geolookup/q/"
    var weatherURL = baseWeatherURL + llatitude + "," + llongitude + ".json";
    var specialLocURL = baseWeatherURL + stateLocation + "/" + cityLocation + ".json";
    $.ajax({
      url: specialLocURL,
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
        console.log(specialLocURL);
        console.log(response);
        //  Weather Query for Today
        if (time == 0) {
          weatherCondition = response.current_observation.weather;
          location = response.current_observation.display_location.full;
          weatherUpdate = "Today, the weather in " + location + " is " + weatherCondition;
          console.log(weatherUpdate);
        }
        //  Weather Query for Tomorrow
        else if (time == 1) {
          weatherCondition = response.forecast.simpleforecast.forecastday[1].conditions;
          location = response.current_observation.display_location.full;
          weatherUpdate = "Tomorrow, in " + location + " the weather will be " + weatherCondition;
          console.log(weatherUpdate);
        }
        //  Weather Query for Weekend
        else if (time == 2) {
          var Saturday,
              forecastDayW;
          var forecastLength = response.forecast.simpleforecast.forecastday.length;

          for(i=0; i < forecastLength; i++) {
            forecastDayW = response.forecast.simpleforecast.forecastday[i].date.weekday;
            if (forecastDayW == "Saturday") {
              weatherCondition = response.forecast.simpleforecast.forecastday[i].conditions;
              break;
            }
          }
          location = response.current_observation.display_location.full;
          weatherUpdate = "This weekend, in " + location + " the weather will be " + weatherCondition;
          console.log(weatherUpdate);
        };
        // Effect Dom element
        var x = document.getElementById("weatherResults");
        x.innerHTML = weatherUpdate;
      }
    });
  };

  // check asset load
  function imgLoad() {
    var x = document.getElementById("lampShade").complete;
    var y = document.getElementById("lampArm").complete;
    var z = document.getElementById("lampBase").complete;

    if ((x)&&(y)&&(z)) {
      console.log("Load Success");
    }

  };

  window.onload = function() {
    imgLoad();
  };

  // Switch cases for setting the lamp movement mapping
  function whatIsW () {
    console.log("Switch On " + weatherCondition);
    switch (weatherCondition) {
      case "Chance of Flurries":
          gesture = "low";
          break;
      case "Chance of Rain":
          gesture = "low";
          break;
      case "Chance Rain":
          gesture = "low";
          break;
      case "Chance of Freezing Rain":
          gesture = "low";
          break;
      case "Chance of Sleet":
          gesture = "low";
          break;
      case "Chance of Snow":
          gesture = "low";
          break;
      case "Chance of Thunderstorms":
          gesture = "low";
          break;
      case "Chance of a Thunderstorm":
          gesture = "low";
          break;
      case "Clear":
          gesture = "high";
          break;
      case "Cloudy":
          gesture = "medium";
          break;
      case "Flurries":
          gesture = "medium";
          break;
      case "Fog":
          gesture = "medium";
          break;
      case "Haze":
          gesture = "medium";
          break;
      case "Mostly Cloudy":
          gesture = "medium";
          break;
      case "Mostly Sunny":
          gesture = "high";
          break;
      case "Partly Cloudy":
          gesture = "medium";
          break;
      case "Partly Sunny":
          gesture = "high";
          break;
      case "Freezing Rain":
          gesture = "low";
          break;
      case "Rain":
          gesture = "low";
          break;
      case "Sleet":
          gesture = "low";
          break;
      case "Snow":
          gesture = "low";
          break;
      case "Sunny":
          gesture = "high";
          break;
      case "Thunderstorms":
          gesture = "low";
          break;
      case "Thunderstorm":
          gesture = "low";
          break;
      case "Unknown":
          gesture = "medium";
          break;
      case "Overcast":
          gesture = "medium";
          break;
      case "Scattered Clouds":
          gesture = "medium";
          break;
    }

    if (gesture == "low") {
      classes = [" lampArmDn", " lampShadeDn", "R"]
    } else if (gesture == "medium") {
      classes = [" lampArmMd", " lampShadeMd", "O"]
    } else {
      classes = [" lampArmUp", " lampShadeUp", "C"]
    }

    return classes;
  };

});