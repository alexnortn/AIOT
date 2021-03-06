#include <Bridge.h>
#include <YunServer.h>
#include <YunClient.h>
 
#define PORT 5555
YunServer server(PORT);
 
int ledPin = 13;
int val = 0;
String ledValue = String(ledPin);
boolean commandMode = false;

void setup() {
  Serial.begin(115200);
  Serial1.begin(linuxBaud);  // open serial connection to Linux
  Bridge.begin();
  server.noListenOnLocalhost();
  server.begin();
  
  pinMode(ledPin, LOW);
  digitalWrite(ledPin, LOW);  
}


void loop() {
  val = digitalRead(ledPin);
  Bridge.put(String("ledPin"), String(val));
  YunClient client = server.accept();
  
  bridgeFunc();

  if (client) {
    process(client);
    client.stop();
  }

  delay(50); 
  
}

void process(YunClient client) {
  String command = client.readStringUntil('/');

  if (command == "digital") {
    digitalCommand(client);
  }
  if (command == "analog") {
    analogCommand(client);
  }
  if (command == "mode") {
    modeCommand(client);
  }
}

void digitalCommand(YunClient client) {
  int pin, value;
  pin = client.parseInt();

  if (client.read() == '/') {
    value = client.parseInt();
    digitalWrite(pin, value);
  } 
  else {
    value = digitalRead(pin);
    client.print(F("Pin D"));
  client.print(pin);
  client.print(F(" set to "));
  client.println(value);

  String key = "D";
  key += pin;
  Bridge.put(key, String(value));
}
  }
  
  void analogCommand(YunClient client) {
  int pin, value;

  pin = client.parseInt();

  if (client.read() == '/') {
    value = client.parseInt();
    analogWrite(pin, value);

    // Send feedback to client
    client.print(F("Pin D"));
    client.print(pin);
    client.print(F(" set to analog "));
    client.println(value);

    String key = "D";
    key += pin;
    Bridge.put(key, String(value));
  }
  else {
    value = analogRead(pin);

    client.print(F("Pin A"));
    client.print(pin);
    client.print(F(" reads analog "));
    client.println(value);

    String key = "A";
    key += pin;
    Bridge.put(key, String(value));
  }
}

void modeCommand(YunClient client) {
  int pin;
  pin = client.parseInt();
  if (client.read() != '/') {
    client.println(F("error"));
    return;
  }
  
  String mode = client.readStringUntil('\r');

  if (mode == "input") {
    pinMode(pin, INPUT);
    // Send feedback to client
    client.print(F("Pin D"));
    client.print(pin);
    client.print(F(" configured as INPUT!"));
    return;
  }

  if (mode == "output") {
    pinMode(pin, OUTPUT);
    // Send feedback to client
    client.print(F("Pin D"));
    client.print(pin);
    client.print(F(" configured as OUTPUT!"));
    return;
  }

  client.print(F("error: invalid mode "));
  client.print(mode);
}

void bridgeFunc() {
  // copy from USB-CDC to UART
  int c = Serial.read();              // read from USB-CDC
  if (c != -1) {                      // got anything?
    if (commandMode == false) {       // if we aren't in command mode...
      if (c == '~') {                 //    Tilde '~' key pressed?
        commandMode = true;           //       enter in command mode
      } else {
        Serial1.write(c);             //    otherwise write char to UART
      }
    } else {                          // if we are in command mode...
      if (c == '0') {                 //     '0' key pressed?
        Serial1.begin(57600);         //        set speed to 57600
        Serial.println("Speed set to 57600");
      } else if (c == '1') {          //     '1' key pressed?
        Serial1.begin(115200);        //        set speed to 115200
        Serial.println("Speed set to 115200");
      } else if (c == '2') {          //     '2' key pressed?
        Serial1.begin(250000);        //        set speed to 250000
        Serial.println("Speed set to 250000");
      } else if (c == '3') {          //     '3' key pressed?
        Serial1.begin(500000);        //        set speed to 500000
        Serial.println("Speed set to 500000");
      } else if (c == '~') {          //     '~` key pressed?
                                      //        send "bridge shutdown" command
        Serial1.write((uint8_t *)"\xff\0\0\x05XXXXX\x7f\xf9", 11);
        Serial.println("Sending bridge's shutdown command");
      } else {                        //     any other key pressed?
        Serial1.write('~');           //        write '~' to UART
        Serial1.write(c);             //        write char to UART
      }
      commandMode = false;            //     in all cases exit from command mode
    }
  }

  // copy from UART to USB-CDC
  c = Serial1.read();                 // read from UART
  if (c != -1) {                      // got anything?
    Serial.write(c);                  //    write to USB-CDC
  }
}
