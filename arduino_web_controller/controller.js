$( document ).ready(function() {

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

});
