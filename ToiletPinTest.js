var b = require('octalbonescript'); //load the library

// *********** Variables *************\\
var heartState = b.LOW;
var toiletColorState = 'off';
var presenceColorState = 'off';
var buzzerDutyCycle = 0.5;
var buzzerFreq = 2000;
var heartbitRate = 1000;
var presencePressed = 0; //to track how many times presence button is presse
var duration = 100; // buzzer duration
var flickerTime = 1000;


//rgb led pin assign for toilet light
var toiletLightRed  = 'P9_18'; //10ohm resistor is connected
var toiletLightBlue = 'P9_26'; // 10ohm resistor is connected
var toiletLightGreen = 'P9_22'; // 10ohm resistor is connected

//toilet pull cord 
var presenceIndicationOff = 'P8_07';
var presenceIndicationYellow =  'P8_09';
var callIndicationSound = 'P8_19'; //buzzer
var presence_button = 'P9_14'; //presence button is the input of nurse presence, this pin is pulled low externally by a 7.5k ohm res
var pull_cord = 'P9_12'; // pull cord is the input of patient to call the nurse , this pin is pulled low externally by a 7.5k ohm res
var callIndicationSound = 'P8_19'; //buzzer

///********* pin Assigning ***********\\\
var heartbit = 'USR0';
var userLed1 = 'USR1';
var userLed2 = 'USR2';
var userLed3 = 'USR3';

/// ******** pinMode setup ***********\\
// setting outputs of onboard LED
var resp1 = b.pinModeSync(heartbit,b.OUTPUT); // declearing user led 0 as output
var resp2 = b.pinModeSync(userLed1,b.OUTPUT);
var resp3 = b.pinModeSync(userLed2,b.OUTPUT);
var resp4 = b.pinModeSync(userLed3,b.OUTPUT);

// setting outputs of toiletlight LED
var resp5 = b.pinModeSync(toiletLightRed,  b.OUTPUT);
var resp6 = b.pinModeSync(toiletLightBlue, b.OUTPUT);
var resp7 = b.pinModeSync(toiletLightGreen, b.OUTPUT);


// setting outputs of Patient Call Point light LED
var resp8 = b.pinModeSync(presenceIndicationYellow,  b.OUTPUT);
var resp9 = b.pinModeSync(presenceIndicationOff, b.OUTPUT);




///*****************function loop************************ \\\ 
setInterval(hearRate, heartbitRate); //Checking the Heartbit
console.log('HeartBit started of toilet Controller');
presenceIndication('on');// yellow color 


// below code will assign digital output mode to pin and when the pin is ready, it will put it in HIGH state.
b.attachInterrupt(pull_cord, b.CHANGE, function(err, resp) {
  if(err){
    //console.error(err.message);
    console.error("Unable to Generate Pendant Interrupt");
    process.exit(194);
  }
  //callNurse();
  soundIndication(duration);
  console.log("Pull Cord Pulled");
}, function(err){
  if(err){
    //console.error(err.message);
    console.error("Unable to Initialize Pendant");
    process.exit(195);
  }else console.log('Pull Cord Ready');
  
});


//presence button of toilet controller
b.attachInterrupt(presence_button, b.RISING, function(err, resp) {
  if(err){
    //console.error(err.message);
    console.error("Unable to Press Presence button");
    process.exit(196);
  }
  //nursePresence();
  console.log("Pressed the presence button");
}, function(err){
  if(err){
    //console.error(err.message);
    console.error("Unable to Initialize Presence Button");
    process.exit(197);
  }else console.log('Presene button Ready');
  
});

// below code will assign analog output mode to pin and when the pin is ready, it will write 0.5 value.
b.pinMode(callIndicationSound, b.ANALOG_OUTPUT, function(err1) {
  if (err1) {
    //console.error(err1.message); //output any error
    console.error("Unable to set buzzer pinMode");
    process.exit(191);
  }else console.log('Buzzer Ready');
  
  b.analogWrite(callIndicationSound,buzzerDutyCycle, buzzerFreq, function(err2) {
      if (err2) {
        //console.error(err2.message); //output any error
        console.error("Unable to Start Buzzer");
        process.exit(192);
      }
  });
  
  setTimeout(function(){
    b.stopAnalog(callIndicationSound, function(err){
    if(err){
      //console.error(err.message);
      console.error("Unable to Stop Buzzer");
      process.exit(193);
    }
    });
    
  }, duration);
  
});



////******FUNCTIONS*******\\\\\\\\\\\\

// this is a function to turn on & off User led 0. To indicate that device is Alive
// inputs: none
// outputs: none
// used: used as a callback function with a interval of 1000ms 
function hearRate()  
{
    if (heartState == b.LOW) heartState = b.HIGH; //toggling heartbit
    else heartState = b.LOW;
        
    b.digitalWriteSync(heartbit, heartState); // here state can be 0 / 1.
}
// end of heartRate function

//this is a function to generate beep
//Description:- Whenever patient calls nurse its a sound indication to confirm that the call is happend. or any kind of error also generate sound
//inputs:- delay in milliseconds (the duration of how long the sound will be)
//outputs:- none
function soundIndication(milliseconds){ 
    
    b.startAnalog(callIndicationSound, function(err){
        if(err){
            console.error(err.message);
        }
    });
  
  setTimeout(function(){
    b.stopAnalog(callIndicationSound, function(err){
    if(err){
      console.error(err.message);
    }
    });
    
  }, milliseconds);
    
};


//This is a function to turn on ward light. 
// Description:- this function takes color name as input and turn on the respective pins to turn on that color
// inputs :- 'red', 'green', 'blue', 'yellow', 'pink', 'white', default no color
// outputs:- none
function presenceIndication(color){
    
        switch (color) {
            case 'off': // off color
            b.digitalWriteSync(presenceIndicationOff,  b.HIGH);
            b.digitalWriteSync(presenceIndicationYellow, b.LOW);
            break;
            case 'on': // yellow color
            b.digitalWriteSync(presenceIndicationOff,  b.LOW);
            b.digitalWriteSync(presenceIndicationYellow, b.HIGH);
            break;
            default:
            b.digitalWriteSync(presenceIndicationOff,  b.LOW);
            b.digitalWriteSync(presenceIndicationYellow, b.LOW);
        }
       // console.log("presence Indication: " + color);
}

//This is a function to turn on toilet light. 
// Description:- this function takes color name as input and turn on the respective pins to turn on that color
// inputs :- 'red', 'green', 'blue', 'yellow', 'pink', 'white', default no color
// outputs:- none
function toiletLight(color){
    
    switch (color) {
        case 'red': // red color
        b.digitalWriteSync(toiletLightRed,  b.HIGH);
        b.digitalWriteSync(toiletLightBlue, b.LOW);
        b.digitalWriteSync(toiletLightGreen, b.LOW);
        break;
        case 'green': // green color
        b.digitalWriteSync(toiletLightRed,  b.LOW);
        b.digitalWriteSync(toiletLightBlue, b.LOW);
        b.digitalWriteSync(toiletLightGreen, b.HIGH);
        break;
        case 'blue': // blue color
        b.digitalWriteSync(toiletLightRed,  b.LOW);
        b.digitalWriteSync(toiletLightBlue, b.HIGH);
        b.digitalWriteSync(toiletLightGreen, b.LOW);
        break;
        case 'pink': // pink color
        b.digitalWriteSync(toiletLightRed,  b.HIGH);
        b.digitalWriteSync(toiletLightBlue, b.HIGH);
        b.digitalWriteSync(toiletLightGreen, b.LOW);
        break;
        case 'cyan': // cyan color
        b.digitalWriteSync(toiletLightRed,  b.LOW);
        b.digitalWriteSync(toiletLightBlue, b.HIGH);
        b.digitalWriteSync(toiletLightGreen, b.HIGH);
        break;
        case 'yellow': // yellow color
        b.digitalWriteSync(toiletLightRed,  b.HIGH);
        b.digitalWriteSync(toiletLightBlue, b.LOW);
        b.digitalWriteSync(toiletLightGreen, b.HIGH);
        break;
        case 'white': // yellow color
        b.digitalWriteSync(toiletLightRed,  b.HIGH);
        b.digitalWriteSync(toiletLightBlue, b.HIGH);
        b.digitalWriteSync(toiletLightGreen, b.HIGH);
        break;
        default:
        b.digitalWriteSync(toiletLightRed,  b.LOW);
        b.digitalWriteSync(toiletLightBlue, b.LOW);
        b.digitalWriteSync(toiletLightGreen, b.LOW);
    }
    // console.log("toilet light:" + color);
        
}