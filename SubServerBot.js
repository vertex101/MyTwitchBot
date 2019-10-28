const config = require('./config/cfg.json');
const tmi = require('tmi.js');
const Rcon = require('modern-rcon');
const fs = require('fs');
const notifier = require('node-notifier');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
const rcon = new Rcon(config.server.host, config.server.port, config.server.passw, 5000);
var blacklist = []
var isLive = false;
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
            if(msg[1] > 0) {
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
            } else {
                setTimeout(function () {
                    client.say(channel, "!addme [Minecraft-IGN]");
                }, 3000); 
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
        //blacklist people from using the command
        if(msg[0] == "!blist") {
            if(msg[1] == "add") {
                fs.readFile('config/black.json', (err, data) => {  
                    var json = JSON.parse(data);
                    json['black' + msg[3].toLowerCase()] = msg[3].toLowerCase()
                    console.log(JSON.stringify(json, null, 2))
                    fs.writeFile('config/trusted.json', JSON.stringify(json, null, 2), (err) => {  
                        if (err) throw err;
                        setTimeout(function () {
                            client.say(channel, msg[3] + " you have been added to the blacklist")
                        }, 3000); 
                    });
                });
            }
        }
    }

    if(user.username == "vertex101") { //
        if(msg[0] == "!smite") {
            if(msg[1]) {
                rcon.connect().then(() => {
                    return rcon.send('smite ' + msg[1]);
                }).then(() => {
                    return rcon.disconnect();
                });
            }
        }
    }
});

if(isLive = false) {
    notifier.notify({
        title: 'Stream Live',
        message: 'Sketch has went live!'
    });
    isLive = true;
}

rl.setPrompt('>');
rl.prompt();
rl.on('line', function(line) {
    client.say("#sketch", line)
    rl.prompt();
});