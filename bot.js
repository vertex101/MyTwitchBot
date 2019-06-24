const tmi = require('tmi.js');
var request = require('request');
const config = require('./config/cfg.json');
const fs = require('fs');

let options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: config.twitch.nick,
        password: config.twitch.oauth
    },
    channels: ["#rusty_blitzcrank", "finncapp", "vertex101"]
};

let client = new tmi.client(options);

// Connect the client to the server..
client.connect();

client.on("chat", (channel, user, message, self) => {
    // Don't listen to my own messages..
    if (self) return;
    // Do your stuff.
    msg = message.split(" ");
    if(channel == "#finncapp" || channel == "#vertex101"){
        if(user.username == channel.replace("#", "") || user.username == "vertex101"){
            if(msg[0] == "!ex"){
                request('https://poe.ninja/api/Data/GetCurrencyOverview?league=Legion', function (error, response, body) {
                    pullData = JSON.parse(body);
                    setTimeout(function () {
                        client.say(channel, "1 Exalted Orb is equal to " + pullData.lines[2].chaosEquivalent + " Chaos")
                    }, 3000); 
                });
            }
        }
    }
});

function sendCMD() {
    client.say("#rusty_blitzcrank", "!grab");
  }

setInterval(sendCMD, 2100000)