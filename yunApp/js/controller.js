$( document ).ready(function() {

  // Deal with the Arduino Buttons...

  $('#today_id').click(function(){
    $( ".lampArm" ).toggleClass("lampArmUp");
    $( ".lampShade" ).toggleClass( "lampShadeUp" );
    console.log("Today Weather is Clear");
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
 
  $('#tomorrow_id').click(function(){
    $( ".lampArm" ).toggleClass("lampArmDn");
    $( ".lampShade" ).toggleClass( "lampShadeDn" );
    console.log("Today Weather is Rainy");
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

  $('#weekend_id2').click(function(){
    $( ".lampArm" ).toggleClass("lampArmMd");
    $( ".lampShade" ).toggleClass( "lampShadeMd" );
    console.log("Today Weather is Overcast");
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
      console.log(position);
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
    var weatherURL = "http://api.wunderground.com/api/9867e8006f7cddb7/forecast10day/conditions/q/tokyo.json"
    $.ajax({
      url: weatherURL,
      jsonp: "callback",
      dataType: "jsonp",
      data:{},
      success: function(response){
        console.log(weatherURL);
        console.log(response);
        var x = document.getElementById("weatherResults");
        x.innerHTML = weatherURL;
      }
    });
  });

});
