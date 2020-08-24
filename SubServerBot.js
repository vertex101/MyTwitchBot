const config = require('./config/cfg.json');
const Rcon = require('modern-rcon');
const tmi = require('tmi.js');
const fs = require('fs');

const rcon = new Rcon(config.server.host, config.server.port, config.server.passw);

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
    channels: ["#sketch", "#vertex101"]
};

let client = new tmi.client(options);

// Connect the client to the server..
client.connect();

client.on("chat", (channel, user, message, self) => {
    // Don't listen to my own messages..
    if (self) return;
    // Do your stuff.
    msg = message.split(" ");
    //Sketch sub server commands
    if(user.subscriber || user.mod || user.username == "vertex101" || user.username == channel.replace("#", "")) {
        //subs can now add to whitelist themselfs
        if(msg[0] == "!addme") {
            if(msg[1].length != 0) {
                rcon.connect().then(() => {
                    return rcon.send('whitelist add ' + msg[1]);
                }).then(res => {
                    console.log(res)
                    setTimeout(function() { client.say(channel, res); }, 3000)
                }).then(() => {
                    return rcon.send('whitelist reload');
                }).then(res => {
                    setTimeout(function() { client.say(channel, res); }, 4500)
                }).then(() => {
                    return rcon.disconnect();
                });
            }
        }
    }
    if(user.username == channel.replace("#", "") || user.username == "vertex101" || user.mod) {
        //remove a user from the whitelist
        if(msg[0] == "!wremove") {
            rcon.connect().then(() => {
                    return rcon.send('whitelist remove ' + msg[1]);
                }).then(res => {
                    setTimeout(function() { client.say(channel, res); }, 3000)
                }).then(() => {
                    return rcon.send('whitelist reload');
                }).then(res => {
                    setTimeout(function() { client.say(channel, res); }, 4500)
                }).then(() => {
                    return rcon.disconnect();
            });
        }
    }
});