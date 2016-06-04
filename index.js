var gprs = require('gprs-sim900');
var twitter = require('twitter');

var twitterHandle = '@nodeschoolla';

var twit = new twitter({
  consumer_key: 'O7oc0pvsZn4xjgcuHuYdX4FaC',
  consumer_secret: 'iJYuHFz2sD46Nvk3mcwzX8uih14aEAMgVWdWoR59nx8v6Zl7ZX',
  access_token_key: '2529232909-luARGU89K4CKFMvfzBjCgG6ubefzDkdDWkSB85i',
  access_token_secret: 'GXQfuzvGdjLEs3t1HEYfhQ9x9bdBcSBVXjBkbRgwYlOE0'
});


gprs.on('ready', function(){
  console.log('gprs connected');
});

gprs.on('data', function(d){

  twit.post('statuses/update', {status: status}, function(error, tweet, response){
    if (error) {
      console.log('error sending tweet:', error);
    } else {
      console.log('Successfully tweeted! Tweet text:', tweet.text);
    }
  });
});
// Make a tweet!
