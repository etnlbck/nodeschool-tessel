
// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
Use the GPRS module to send a text to a phone
number of your choice.
*********************************************/
require('dotenv').load();
var tessel = require('tessel');
var gprslib = require('gprs-sim900');
var twitter = require('twitter');

var twitterHandle = '@nodeschoolla';

var twit = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var phoneNumber = '18189614222'; // Replace the #s with the String representation of the phone number, including country code (1 for USA)
var message = 'NodeSchool LA is fun! We\'re playing with Tessels';
var status = twitterHandle + ' ' + message;

//  Port, callback
var gprs = gprslib.use(tessel.port['A']);

var tweet = function(status) {
  status = status || 'Tessel Booted';

  twit.post('statuses/update', {status: status}, function(error, tweet, response){
    if (error) {
      console.log('error sending tweet:', error);
    } else {
      console.log('Successfully tweeted! Tweet text:', tweet.text);
    }
  });
};
gprs.on('ready', function() {
  console.log('GPRS module connected to Tessel. Searching for network...')
  //  Give it 10 more seconds to connect to the network, then try to send an SMS

  tweet();

  setTimeout(function() {
    console.log('Sending', message, 'to', phoneNumber, '...');
    // Send message
    gprs.sendSMS(phoneNumber, message, function smsCallback(err, data) {
      if (err) {
        return console.log(err);
      }
      var success = data[0] !== -1;
      console.log('Text sent:', success);
      if (success) {
        // If successful, log the number of the sent text
        console.log('GPRS Module sent text #', data[0]);
      }
    });
  }, 10000);
});

//  Emit unsolicited messages beginning with...
gprs.emitMe(['NORMAL POWER DOWN', 'RING', '+']);

gprs.on('NORMAL POWER DOWN', function powerDaemon () {
  gprs.emit('powered off');
  console.log('The GPRS Module is off now.');
});

gprs.on('RING', function someoneCalledUs () {
  var instructions = 'Someone\'s calling!\nType the command \'ATA\' to answer and \'ATH\' to hang up.\nYou\'ll need a mic and headset connected to talk and hear.\nIf you want to call someone, type \'ATD"[their 10+digit number]"\'.';
  console.log(instructions);

  tweet('Someone Is Calling on your tessel!');

});

gprs.on('+', function handlePlus (data) {

  console.log('Got an unsolicited message that begins with a \'+\'! Data:', data);
});

//  Command the GPRS module via the command line
process.stdin.resume();
process.stdin.on('data', function (data) {
  data = String(data).replace(/[\r\n]*$/, '');  //  Removes the line endings
  console.log('got command', [data]);
  gprs._txrx(data, 10000, function(err, data) {
    console.log('\nreply:\nerr:\t', err, '\ndata:');
    data.forEach(function(d) {
      console.log('\t' + d);
    });
    console.log('');
  });
});

//  Handle errors
gprs.on('error', function (err) {
  console.log('Got an error of some kind:\n', err);
});
