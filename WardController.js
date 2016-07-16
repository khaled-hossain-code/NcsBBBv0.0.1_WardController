var octal = require('octalbonescript'); //load the library
var bone = require('bonescript');
var io = require('socket.io-client');
var socket = io.connect('http://192.168.1.6:8000'); // my pc
//var socket = io.connect('http://192.168.1.22:8000'); // mamshed vai's pc
var os = require( 'os' );

var IP = os.networkInterfaces( ).eth0[0].address;
var payload = {
    IP:IP, //getting from network interfaces file IP='192.168.1.240'
    CallType: 'Normal',
};

var wardLightInterval; //it is a setInterval function
var presenceIndicationInterval; //this one is also a setInterval Function
// *********** Variables *************\\
var heartState = octal.LOW;
var wardColorState = 'off';
var presenceColorState = 'off';
var state = {
    value: 4, //initially at cancel state, so that presence button does not work but pendant button works
    description: "no call",
}; // this system can be in one of the following state 0.No Call 1.Patient Called 2.Emergency 3.BlueCode
var buzzerDutyCycle = 0.5;
var buzzerFreq = 2000;
var heartbitRate = 1000;
var presencePressed = 0;
var duration = 1000; // buzzer duration
var flickerTime = 1000;
///********* pin Assigning ***********\\\
var heartbit = 'USR0';
var userLed1 = 'USR1';
var userLed2 = 'USR2';
var userLed3 = 'USR3';

//rgb led pin assign for ward light
var wardLightRed  = "P9_18"; //10ohm resistor is connected
var wardLightBlue = "P9_26"; // 10ohm resistor is connected
var wardLightGreen = "P9_22"; // 10ohm resistor is connected

var presenceIndicationRed = "P8_07";
var presenceIndicationGreen =  "P8_09";
var callIndicationSound = "P8_19"; //buzzer

var callIndicationSound = 'P8_19'; //the pin to operate on

// below code will assign analog output mode to pin and when the pin is ready, it will write 0.5 value.
octal.pinMode(callIndicationSound, octal.ANALOG_OUTPUT, function(err1) {
  
  if (err1) {
    console.error(err1.message); //output any error
    return;
  }
  else {
    console.info("analog output is set");
  }
  
  soundIndication(duration);
  
});



////////// SERVICES \\\\\\\\\\\\\\\\\\\

//this is a function to generate beep
//Description:- Whenever patient calls nurse its a sound indication to confirm that the call is happend. or any kind of error also generate sound
//inputs:- delay in milliseconds (the duration of how long the sound will be)
//outputs:- none
function soundIndication(milliseconds){ 
    
    bone.analogWrite(callIndicationSound, buzzerDutyCycle, buzzerFreq);
    if(milliseconds === 'undefined') milliseconds = 100;
    
    setTimeout(function() {
        bone.analogWrite(callIndicationSound, 0);     // Turn off buzzer after milliseconds time 
    }, milliseconds);
}

