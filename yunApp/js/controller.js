$( document ).ready(function() {

  var llatitude = 42.3463503;
  var llongitude = -71.1626756;
  var gesture,
      classes,
      timer,
      weatherUpdate;
  var weatherCondition;
  var time = 0;
  var location = "Boston, Ma";
  var autoUpdate = false;
  var updateFunc;

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

  $('#autoUpdate').click(function(){
    autoUpdate = !autoUpdate;
    if (autoUpdate) {
      console.log("Auto Update");
      updateFunc = setInterval( function () { checkWeather(time) }, timer);
      $( this ).css( "background-color", "green" )
               .css( "color", "#fafafa" );
    } else {
      $( this ).css( "background-color", "#fafafa" )
               .css( "color", "black" );
      console.log("Manual Update");
      clearInterval(updateFunc);
    }
  });

  var query = function() {
      loadWeather(time);
      whatIsW(weatherCondition);
    };

  function updateInterval(minute) {
    var interval = minute * 60000;
    console.log("Time Interval set for " + minute + " minute(s)");
    return interval;
  }

  timer = updateInterval(5);

  function checkWeather(time) {
    console.log("Auto Update Weather");
    query();
    $( "#lampArm" ).removeClass().addClass("lampArm" + classes[0]);
    $( "#lampShade" ).removeClass().addClass("lampShade" + classes[1]);
    $.ajax({
      url: "http://" + ip0 + "/arduino/digital/13/1",
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

  // Create instance of this Class, use the 'get' method to call function

  $('#weather').click(function(){
    checkWeather(time);
  });

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
      classes = [" lampArmDn", " lampShadeDn"]
    } else if (gesture == "medium") {
      classes = [" lampArmMd", " lampShadeMd"]
    } else {
      classes = [" lampArmUp", " lampShadeUp"]
    }

    return classes;
  };

});