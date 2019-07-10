const config = require('./config/cfg.json');
const tmi = require('tmi.js');
const Rcon = require('modern-rcon');
const rcon = new Rcon(config.server.host, config.server.port, config.server.passw, 5000);

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
    if(user.username == channel.replace("#", "") || user.username == "vertex101" || user.mod) {
        //add a user to the whitelist
        if(msg[0] == "!wadd") {
                rcon.connect().then(() => {
                        return rcon.send('whitelist add ' + msg[1]);
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