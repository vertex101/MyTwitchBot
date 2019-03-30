const tmi = require('tmi.js');
const Rcon = require('modern-rcon');
const config = require('./config/cfg.json');

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
    channels: [ "#vertex101" ]
};

let client = new tmi.client(options);

// Connect the client to the server..
client.connect();