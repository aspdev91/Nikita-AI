//-------------------------------------------------------
// Nikita AI Arduino 
//
//--------------------------------------------------------
 

#include <MeOrion.h>
#include <Arduino.h>
#include <SoftwareSerial.h>
#include <Wire.h>

//Global variables.
char g_version[] = "0.10\n";
MeDCMotor g_motorL( M1 );  
MeDCMotor g_motorR( M2 );
MeUltrasonicSensor ultraSensor( PORT_4 ); 
unsigned long timer = 0; 

//Setup the hardware.
void setup() 
{
  //Setup USB serial comms.
  Serial.begin( 115200 );
  Serial.setTimeout( 100 );
}

//This function is called forever.
void loop() 
{
  //Read serial commands.
  while( Serial.peek() != -1 )
  {
    //Read 3 character command.
    char cmd[4] = "---";
    Serial.readBytes( cmd, 3 );
    
    //Execute command.
    if( strcmp( cmd, "buz" )==0 ) Buzzer();
    else if( strcmp( cmd, "stp" )==0 ) Stop(); 
    else if( strcmp( cmd, "fwd" )==0 ) Forward();
    else if( strcmp( cmd, "rev" )==0 ) Reverse();
    else if( strcmp( cmd, "lft" )==0 ) Left();
    else if( strcmp( cmd, "rgt" )==0 ) Right();
    else if( strcmp( cmd, "ver" )==0 ) GetVersion();
  } 
  
  //Report status every second.
  if( (millis()-timer) > 1000 ) 
  {
     timer += 1000;
     Report();
  }
}

//Get software version.
void GetVersion()
{
  Serial.print( g_version );
}

//Send status back to DroidScript App.
void Report()
{
  int dist = ultraSensor.distanceCm();
  Serial.println( String("dist:") + dist + String(";") );
}

//Control buzzer.
void Buzzer()
{
  //Read on/off parameter.
  char onOff;
  Serial.readBytes( &onOff, 1 );
  
  //Start of stop buzzer.
  if( onOff=='y' ) buzzerOn();
  else buzzerOff();
}

//Turn vehicle left.
void Left()
{
  //Read speed parameter.
  int speed = Serial.parseInt();
  
  //Turn on motors.
  g_motorL.run( -speed );
  g_motorR.run( speed );
}

//Turn vehicle right.
void Right()
{
  //Read speed parameter.
  int speed = Serial.parseInt();
  
  //Turn on motors.
  g_motorL.run( speed );
  g_motorR.run( -speed );
}

//Drive vehicle forward.
void Forward()
{
  //Read speed parameter.
  int speed = Serial.parseInt();
  
  //Turn on motors.
  g_motorL.run( speed );
  g_motorR.run( speed );
}

//Reverse vehicle.
void Reverse()
{
  //Read speed parameter.
  int speed = Serial.parseInt();
  
  //Turn on motors.
  g_motorL.run( -speed );
  g_motorR.run( -speed );
}

//Stop vehicle.
void Stop()
{
  //Turn off motors.
  g_motorL.run( 0 );
  g_motorR.run( 0 );
}