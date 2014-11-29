import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import processing.serial.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class Lamp extends PApplet {




/*
	Alex Norton 2014
	MIT // Architecture + The Intenet of Things

	A Japanese style desk lamp that incremently responds to weather conditions
		Cantilevered Arm
			-> Bows for rainy skies
			-> Neutral for overcast skies
			-> Elevates for clear skies
		Lamp Element
			-> Cooler temperature = cooler color temperature
			-> Warmer temperature = warmer color temperature
*/





JSONObject woeidReturn;

String weatherURL = "http://weather.yahooapis.com/forecastrss?w=",
	   woeid,
	   forecastElements,
	   locationURL = "http://search.yahoo.com/sugg/gossip/gossip-gl-location/?appid=weather&output=sd1&p2=pt&command=",
	   fullWeatherURL,
	   woeidURL,
	   locationW,
	   boston = "2367105",
	   tokyo = "1118370",
	   denver = "2391279";

char[] weatherUpdate;
Serial lampCom;
XML    report;
long   m;
int    delayQuery,
	   minuteDelay,
	   secDelay,
	   frameSpeed;


public void setup() {
	size(200,200);
	// delay is the time between API calls for weather updates
	// multiple framerate by 60 (seconds)
	frameSpeed = 1;
	// Agree to query every 30 minutes, but will test faster
	minuteDelay = 1; 
	secDelay = 60;
	delayQuery = minuteDelay * frameSpeed * secDelay;

	println(Serial.list());
	lampCom = new Serial(this, "COM4", 9600);

	locationW = "tokyo";
	woeid = "2367105";
	forecastElements = "&u=f&d=7";
	// load JSON object from URL
	woeidURL = locationURL + locationW;
	woeidReturn = loadJSONObject(woeidURL);

	JSONArray more = woeidReturn.getJSONArray("r");
	// String more2 = more.getJSONObject(0);
	println(more);

	fullWeatherURL = weatherURL + woeid + forecastElements;

	// weatherQuery();
	// weatherUpdate = weatherQuery();

	// lampCom.write(weatherUpdate);  
}

public void draw() {
	frameRate(frameSpeed);
	m = frameCount;
	 if ((lampCom.available() > 0) || (m > 0)) {
	 	// println("available");
		if (m % delayQuery == 0) {
			weatherUpdate = weatherQuery();
			lampCom.write(weatherUpdate[0]);
		}
	}

}

public char[] weatherQuery() {
	report = loadXML(fullWeatherURL);
	char weatherCondition = 'R';
	char tomorrowCondition = 'R';
	char weekendCondition = 'R';

	// Do all the variable passing for the recent weather query here
	  XML    kid = report.getChild("channel/item");

	  int    windSpeed= report.getChild("channel/yweather:wind").getInt("speed");
	  int    windDirection = report.getChild("channel/yweather:wind").getInt("direction");
	  int    temperature = kid.getChild("yweather:condition").getInt("temp");
	  int    conditionCode = kid.getChild("yweather:condition").getInt("code");
	  int    weekendWeather = 0;

	  String location = report.getChild("channel/yweather:location").getString("city");
	  String conditionText = kid.getChild("yweather:condition").getString("text");
	  String date = kid.getChild("yweather:condition").getString("date");

	  	 // Forecasting Tomorrow + Weekend
 	  XML[] yweatherForecast = kid.getChildren("yweather:forecast");
			// println("This is the weather for tomorrow ");
			// println(yweatherForecast[0]);
	  int   tomWeather = yweatherForecast[0].getInt("code");

		for (int i = 0; i < yweatherForecast.length; i++) {
			String weekendDay = "Sat";
			String weatherParse = yweatherForecast[i].getString("day");
			if (weatherParse.equals(weekendDay)) {
				// println("This is the weather for next weekend ");
				// println(yweatherForecast[i]);
				weekendWeather = yweatherForecast[i].getInt("code");
				break;	
			}
        }

	  String[] dateList = splitTokens(date); //create date string
	  String[] dateList01 = shorten(dateList);
	  String[] dateList02 = shorten(dateList01);
	  String[] dateList03 = shorten(dateList02);
	  String[] dateList04 = shorten(dateList03);
	  String   dateDisplay = join(dateList04, " ");

	  //  Case statements for determining the lamp-arm position

	  	// Today
	  	if ((conditionCode > 29) && (conditionCode < 35)) {
	      weatherCondition = 'C';
	    }
	    else if ((conditionCode > 18) && (conditionCode < 31)) { 
	      weatherCondition = 'O';
	    }
	    else if (conditionCode == 44) {
	      weatherCondition = 'O';
	    }
	    else if ((conditionCode > -1) && (conditionCode < 5)) {
	      weatherCondition = 'R';
	    }
	    else if ((conditionCode > 8) && (conditionCode < 13)) {
	      weatherCondition = 'R';
	    }
	    else if ((conditionCode > 36) && (conditionCode < 41)) {
	      weatherCondition = 'R';
	    }
	    else if (conditionCode == 45) {
	      weatherCondition = 'R';
	    }
	    else if (conditionCode == 47) {
	      weatherCondition = 'R';
	    }
	    else if ((conditionCode > 4) && (conditionCode < 11)) {
	      weatherCondition = 'R';
	    }
	    else if  ((conditionCode > 12) && (conditionCode < 19)) {
	      weatherCondition = 'R';
	    }
	    else if ((conditionCode > 40) && (conditionCode < 14)) {
	      weatherCondition = 'R';
	    }
	    else if (conditionCode == 46) {
	      weatherCondition = 'R';
	    }
	    else if (conditionCode == 35) {
	      weatherCondition = 'R';
	    }
	    // Tomorrow
	    if ((tomWeather > 29) && (tomWeather < 35)) {
	      tomorrowCondition = 'C';
	    }
	    else if ((tomWeather > 18) && (tomWeather < 31)) { 
	      tomorrowCondition = 'O';
	    }
	    else if (tomWeather == 44) {
	      tomorrowCondition = 'O';
	    }
	    else if ((tomWeather > -1) && (tomWeather < 5)) {
	      tomorrowCondition = 'R';
	    }
	    else if ((tomWeather > 8) && (tomWeather < 13)) {
	      tomorrowCondition = 'R';
	    }
	    else if ((tomWeather > 36) && (tomWeather < 41)) {
	      tomorrowCondition = 'R';
	    }
	    else if (tomWeather == 45) {
	      tomorrowCondition = 'R';
	    }
	    else if (tomWeather == 47) {
	      tomorrowCondition = 'R';
	    }
	    else if ((tomWeather > 4) && (tomWeather < 11)) {
	      tomorrowCondition = 'R';
	    }
	    else if  ((tomWeather > 12) && (tomWeather < 19)) {
	      tomorrowCondition = 'R';
	    }
	    else if ((tomWeather > 40) && (tomWeather < 14)) {
	      tomorrowCondition = 'R';
	    }
	    else if (tomWeather == 46) {
	      tomorrowCondition = 'R';
	    }
	    else if (tomWeather == 35) {
	      tomorrowCondition = 'R';
	    }
	    // Weekend
	    if ((weekendWeather > 29) && (weekendWeather < 35)) {
	      weekendCondition = 'C';
	    }
	    else if ((weekendWeather > 18) && (weekendWeather < 31)) { 
	      weekendCondition = 'O';
	    }
	    else if (weekendWeather == 44) {
	      weekendCondition = 'O';
	    }
	    else if ((weekendWeather > -1) && (weekendWeather < 5)) {
	      weekendCondition = 'R';
	    }
	    else if ((weekendWeather > 8) && (weekendWeather < 13)) {
	      weekendCondition = 'R';
	    }
	    else if ((weekendWeather > 36) && (weekendWeather < 41)) {
	      weekendCondition = 'R';
	    }
	    else if (weekendWeather == 45) {
	      weekendCondition = 'R';
	    }
	    else if (weekendWeather == 47) {
	      weekendCondition = 'R';
	    }
	    else if ((weekendWeather > 4) && (weekendWeather < 11)) {
	      weekendCondition = 'R';
	    }
	    else if  ((weekendWeather > 12) && (weekendWeather < 19)) {
	      weekendCondition = 'R';
	    }
	    else if ((weekendWeather > 40) && (weekendWeather < 14)) {
	      weekendCondition = 'R';
	    }
	    else if (weekendWeather == 46) {
	      weekendCondition = 'R';
	    }
	    else if (weekendWeather == 35) {
	      weekendCondition = 'R';
	    }


    // Function output preparation for Arduino
    char[] weatherPatterns = new char[3];
    weatherPatterns[0] = weatherCondition;
    weatherPatterns[1] = tomorrowCondition;
    weatherPatterns[2] = weekendCondition;
    return weatherPatterns;

}

public void keyReleased() {
	weatherQuery();
	weatherUpdate = weatherQuery();
	if ((key == '1') || ( key == '!')) {
		lampCom.write(weatherUpdate[0]);
		println("The weather today is " + weatherUpdate[0]);
	} else if ((key == '2') || ( key == '@')) {
		lampCom.write(weatherUpdate[1]);
		println("The weather tomorrow will be " + weatherUpdate[1]);
	} else if ((key == '3') || ( key == '#')) {
		lampCom.write(weatherUpdate[2]);
		println("The weather this weekend will be " + weatherUpdate[2]);
	}
}
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "--full-screen", "--bgcolor=#666666", "--stop-color=#cccccc", "Lamp" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
