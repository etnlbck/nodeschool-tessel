var tessel = require("tessel");

tessel.led[2].on();


setInterval(function () {
    console.log("I'm blinking! (Press CTRL + C to stop)");
    // Toggle the led states
    tessel.led[2].toggle();
    tessel.led[3].toggle();
}, 100);
