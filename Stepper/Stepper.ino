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
           ledPin = 7;
           
 char weatherCondition;
 
 int stepNum = 0,
     clearStep = 600,
     overcastStep = 300,
     rainStep = 0,
     counter = 0;
 
void setup() {
 Serial.begin(9600);
 // set the PWM and brake pins so that the direction pins  // can be used to control the motor:
 pinMode(pwmA, OUTPUT);
 pinMode(pwmB, OUTPUT);
 pinMode(brakeA, OUTPUT);
 pinMode(brakeB, OUTPUT);
 digitalWrite(pwmA, HIGH);
 digitalWrite(pwmB, HIGH);
 digitalWrite(brakeA, LOW);
 digitalWrite(brakeB, LOW);
 
 pinMode(ledPin, OUTPUT);
 
 // set the motor speed (for multiple steps only):
 myStepper.setSpeed(10);
 }

 
 void loop() {
   if(Serial.available() > 0){ 
     weatherCondition = Serial.read();
     Serial.print(weatherCondition + " Acknowledged");  //read values in serial monitor
     digitalWrite(ledPin, HIGH);
//     update();
 }
   myStepper.step(400);  
   delay(1000);
   myStepper.step(-400);  
   delay(1000);
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
   int wait = 60000;
   digitalWrite(pwmA, LOW);
   digitalWrite(pwmB, LOW);
   delay(wait);
   digitalWrite(pwmA, HIGH);
   digitalWrite(pwmB, HIGH);   
 }
