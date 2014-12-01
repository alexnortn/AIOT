$( document ).ready(function() {

  // Deal with the Arduino Buttons...

  $('#ledOn_id').click(function(){
    console.log("Success");
    $.ajax({
      url: "http://18.111.60.179/arduino/digital/13/1",
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
         console.log(response);
      }
    });
  });
 
  $('#ledOff_id').click(function(){
    console.log("Success");
    $.ajax({
      url: "http://18.111.60.179/arduino/digital/13/0",
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
         console.log(response);
      }
    });
  });

  $('#ledOn_id2').click(function(){
    console.log("Success");
    $.ajax({
      url: "http://" + ip0 + "/arduino/digital/13/1",
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
         console.log(response);
      }
    });
  });
 
  $('#ledOff_id2').click(function(){
    console.log("Success");
    $.ajax({
      url: "http://" + ip0 +"/arduino/digital/13/0",
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
         console.log(response);
      }
    });
  });

  // Geolocate Function

  $('#geoLocate').click(function(){
    getLocation();
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
    var weatherURL = "http://weather.yahooapis.com/forecastrss?w=2367105&u=f&d=7"
    $.ajax({
      url: weatherURL,
      xml: "callback",
      dataType: "xml",
      data:{},
      success: function(){
        console.log(weatherURL);
        var x = document.getElementById("weatherResults");
        x.innerHTML = weatherURL;
      }
    });
  });

});
