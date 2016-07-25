var b = require('octalbonescript'); //load the library

var pin = 'P8_19'; //the pin to operate on

// below code will assign analog output mode to pin and when the pin is ready, it will write 0.5 value.
b.pinMode(pin, b.ANALOG_OUTPUT, function(err1) {
  if (err1) {
    console.error(err1.message); //output any error
    return;
  }else console.log('analog output set');
  
  b.analogWrite(pin, 0.5, 2000, function(err2) {
      if (err2) {
        console.error(err2.message); //output any error
        return;
      }else console.log('pwm running');
  });
  
  setTimeout(function(){
    b.stopAnalog(pin, function(err){
    if(err){
      console.error(err.message);
    }else console.log('pwm stopped');
    });
    
  }, 100);
  
});