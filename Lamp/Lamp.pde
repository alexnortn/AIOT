


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



import processing.serial.*;

String weatherURL = "http://weather.yahooapis.com/forecastrss?w=1118370&u=f",
	   boston = "2367105",
	   tokyo = "1118370",
	   denver = "2391279";

char   weatherCondition,
	   weatherUpdate;
Serial lampCom;
XML    report;
long   m;
int    delayQuery,
	   minuteDelay,
	   secDelay,
	   frameSpeed;


void setup() {
	size(200,200);
	// delay is the time between API calls for weather updates
	// multiple framerate by 60 (seconds)
	frameSpeed = 1;
	// Agree to query every 30 minutes, but will test faster
	minuteDelay = 1; 
	secDelay = 60;
	delayQuery = minuteDelay * frameSpeed * secDelay;

	println(Serial.list());
	lampCom = new Serial(this, "COM6", 9600);

	weatherQuery();
	weatherUpdate = weatherQuery();
	println("Weather query " + weatherUpdate);

	lampCom.write(weatherUpdate);  
}

void draw() {
	frameRate(frameSpeed);
	m = frameCount;
	 if ((lampCom.available() > 0) || (m > 0)) {
	 	// println("available");
		if (m % delayQuery == 0) {
			weatherUpdate = weatherQuery();http:
			lampCom.write(weatherUpdate);
			println("Weather query " + weatherUpdate);
		}
	}

}

char weatherQuery() {
	report = loadXML(weatherURL);

	// Do all the variable passing for the recent weather query here

	  String location = report.getChild("channel/yweather:location").getString("city");
	  int windSpeed= report.getChild("channel/yweather:wind").getInt("speed");
	  int windDirection = report.getChild("channel/yweather:wind").getInt("direction");

	  XML kid = report.getChild("channel/item");

	  int temperature = kid.getChild("yweather:condition").getInt("temp");
	  String conditionText = kid.getChild("yweather:condition").getString("text");
	  int conditionCode = kid.getChild("yweather:condition").getInt("code");
	  String date = kid.getChild("yweather:condition").getString("date");

	  String[] dateList = splitTokens(date); //create date string
	  String[] dateList01 = shorten(dateList);
	  String[] dateList02 = shorten(dateList01);
	  String[] dateList03 = shorten(dateList02);
	  String[] dateList04 = shorten(dateList03);
	  String   dateDisplay = join(dateList04, " ");
	  char weatherUpdate_;

	  //  Case statements for determining the lamp-arm position


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

    // Function output preparation for Arduino
    weatherUpdate_ = weatherCondition;
    return weatherUpdate_;

}

void keyPressed() {
	if ((key == 'S') || ( key == 's')) {
		weatherQuery();
		weatherUpdate = weatherQuery();
			lampCom.write(weatherUpdate);
			println("Weather query " + weatherUpdate);
	}
}