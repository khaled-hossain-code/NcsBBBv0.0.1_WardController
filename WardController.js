var b = require('octalbonescript'); //load the library
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
var heartState = b.LOW;
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
var duration = 100; // buzzer duration
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

var pin = 'P8_19'; //the pin to operate on

// below code will assign analog output mode to pin and when the pin is ready, it will write 0.5 value.
b.pinMode(pin, b.ANALOG_OUTPUT, function(err1) {
  if (err1) {
    console.error(err1.message); //output any error
    return;
  }
  b.analogWrite(pin, 0.5, 2000, function(err2) {
      if (err2) {
        console.error(err2.message); //output any error
        return;
      }
  });
});
