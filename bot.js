const tmi = require('tmi.js');
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
    channels: ["#rusty_blitzcrank"]
};

let client = new tmi.client(options);

// Connect the client to the server..
client.connect();

client.on("chat", (channel, userstate, message, self) => {
    // Don't listen to my own messages..
    if (self) return;
    // Do your stuff.
});

function sendCMD() {
    client.say("#rusty_blitzcrank", "!grab");
  }

setInterval(sendCMD, 2100000)