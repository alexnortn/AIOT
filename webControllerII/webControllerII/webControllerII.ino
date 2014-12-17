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
         ledPinSvn = 4;
         
char weatherCondition = 'O';

int stepNum = 0,
   clearStep = 600,
   overcastStep = 300,
   rainStep = 0,
   counter = 0, 
   counter2 = 0;                                      
 
#define PORT 5555
YunServer server(PORT);
 
int ledPin = 5;
int val = 0;
String ledValue = String(ledPin);
String message;

long linuxBaud = 250000;

void setup() {
  Bridge.begin();
  Mailbox.begin();
  server.noListenOnLocalhost();
  server.begin();
  
  pinMode(ledPin, LOW);
  digitalWrite(ledPin, LOW);

  // Initialize Serial
  Serial.begin(115200);
  // Serial1.begin(linuxBaud);  // open serial connection to Linux
  
  // Wait until a Serial Monitor is connected.
//  while (!Serial);

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
  myStepper.setSpeed(5);
  rest();
}

void loop() {
  val = digitalRead(ledPin);
  digitalWrite(ledPinSvn, HIGH);
  Bridge.put(String("ledPin"), String(val));
  YunClient client = server.accept();

  // if (client) {
  //   process(client);
  //   client.stop();
  // }
  
  // linux();

  // Call Mail function
  storeMail();

//  delay(50); 

  // Touch the Lamp
  digitalWrite(ledPin, HIGH);
  
  if (counter > counter2) {
    activate();
    update();
    rest();
    Serial.println("Update called!   " + ledPinSvn);
    counter2 ++;

  }
  
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
      counter++;
    }

    Serial.println("Waiting 10 seconds before checking the Mailbox again");
  }

  // Parse the Mail-Message
  if (message.length() == 1) {
    weatherCondition = message.charAt(0);
  }   
}

void update() {   
   if (weatherCondition == 'R') {
     stepNum*= -1;
     myStepper.step(stepNum); 
   } else if (weatherCondition == 'O') {
       if (stepNum == rainStep) {
         stepNum += overcastStep;
         myStepper.step(stepNum);  
       } else if (stepNum == clearStep) {
         stepNum = -1 * (stepNum - overcastStep);
         myStepper.step(stepNum);  
       } else { myStepper.step(0); };       
   } else if (weatherCondition == 'C') {
       if (stepNum == rainStep) {
         stepNum += clearStep;
         myStepper.step(stepNum);  
       } else if (stepNum == overcastStep) {
         stepNum += (clearStep - overcastStep);
         myStepper.step(stepNum);  
       } else if (stepNum == clearStep) {
         myStepper.step(0);  
       };    
   } else if (weatherCondition == 'S') {
       for(int i = 0; i < 5; i++) {
         myStepper.setSpeed(75);
         myStepper.step(25);
         myStepper.step(-25);
        myStepper.step(25);
         myStepper.step(-25); 
        myStepper.step(25);
         myStepper.step(-25); 
        delay(5000); 
       }
   }
 }
 
 void rest() {
   digitalWrite(pwmA, LOW);
   digitalWrite(pwmB, LOW); 
   pinMode(ledPinSvn, OUTPUT);
 }
 
 void activate() {
   digitalWrite(pwmA, HIGH);
   digitalWrite(pwmB, HIGH);
   myStepper.setSpeed(5); 
 }
