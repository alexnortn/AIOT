#include <Bridge.h>
#include <YunServer.h>
#include <YunClient.h>
#include <Mailbox.h>
#include <Stepper.h>

 const int stepsPerRevolution = 200;  // change this to fit the number of steps per revolution
                                      // for your motor

 // initialize the stepper library on the motor shield
 Stepper myStepper(stepsPerRevolution, 12,13);

// give the motor control pins names:
const int pwmA = 3,
         pwmB = 11,
         brakeA = 9,
         brakeB = 8,
         dirA = 12,
         dirB = 13,
         ledPinSvn = 7;
         
char weatherCondition;

int stepNum = 0,
   clearStep = 600,
   overcastStep = 300,
   rainStep = 0,
   counter = 0;                                       
 
#define PORT 5555
YunServer server(PORT);
 
int ledPin = 13;
int val = 0;
String ledValue = String(ledPin);
String message;

void setup() {
  Bridge.begin();
  Mailbox.begin();
  server.noListenOnLocalhost();
  server.begin();
  
  pinMode(ledPin, LOW);
  digitalWrite(ledPin, LOW);

  // Initialize Serial
  Serial.begin(115200);
  
  // Wait until a Serial Monitor is connected.
  while (!Serial);

  Serial.println("Mailbox Read Message\n");
  Serial.println("The Mailbox is checked every 10 seconds. The incoming messages will be shown below.\n");

  // set the PWM and brake pins so that the direction pins  // can be used to control the motor:
  pinMode(pwmA, OUTPUT);
  pinMode(pwmB, OUTPUT);
  pinMode(brakeA, OUTPUT);
  pinMode(brakeB, OUTPUT);
  digitalWrite(pwmA, HIGH);
  digitalWrite(pwmB, HIGH);
  digitalWrite(brakeA, LOW);
  digitalWrite(brakeB, LOW);

  pinMode(ledPinSvn, OUTPUT);

  // set the motor speed (for multiple steps only):
  myStepper.setSpeed(10);

}


void loop() {
  val = digitalRead(ledPin);
  Bridge.put(String("ledPin"), String(val));
  YunClient client = server.accept();

  if (client) {
    process(client);
    client.stop();
  }

  // Call Mail function
  storeMail();

  delay(50); 

  // Touch the Lamp
  digitalWrite(ledPin, HIGH);
  update();
  
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

void storeMail() {
  // if there is a message in the Mailbox
  if (Mailbox.messageAvailable())
  {
    // read all the messages present in the queue
    while (Mailbox.messageAvailable())
    {
      Mailbox.readMessage(message);
      Serial.println(message);
    }

    Serial.println("Waiting 10 seconds before checking the Mailbox again");
  }

  // Parse the Mail-Message
  if (message.length() == 1) {
    weatherCondition = message.charAt(0);
  }

  // wait 10 seconds
  delay(5000);
   
}

void update() {   
   if (weatherCondition == 'R') {
     stepNum*= -1;
     myStepper.step(stepNum);
     rest();  
   } else if (weatherCondition == 'O') {
       if (stepNum == rainStep) {
         stepNum += overcastStep;
         myStepper.step(stepNum);  
         rest();
       } else if (stepNum == clearStep) {
         stepNum = -1 * (stepNum - overcastStep);
         myStepper.step(stepNum);  
         rest();
       } else { myStepper.step(0); };       
   } else if (weatherCondition == 'C') {
       if (stepNum == rainStep) {
         stepNum += clearStep;
         myStepper.step(stepNum);  
         rest();
       } else if (stepNum == overcastStep) {
         stepNum += (clearStep - overcastStep);
         myStepper.step(stepNum);  
       } else if (stepNum == clearStep) {
         myStepper.step(0);  
         rest();
       };    
   }
 }
 
 void rest() {
   // int wait = 60000;
   // digitalWrite(pwmA, LOW);
   // digitalWrite(pwmB, LOW);
   // delay(wait);
   // digitalWrite(pwmA, HIGH);
   // digitalWrite(pwmB, HIGH);   
 }