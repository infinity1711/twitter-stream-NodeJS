const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
var Twit = require('twit');
var config = require('./config')
var T = new Twit(config);
const http = require('http');
const server = http.createServer();
const io = require('socket.io').listen(server);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyparser.json({ extended: true }));


io.on('connection', function (socket) {
    console.log('Socket connected');

    socket.on('tweet', (search) => {
        
        var stream = T.stream('statuses/filter', { track: search })

        stream.on('tweet', function (tweet) {
            // console.log(tweet)
            io.emit('tweets', tweet);
        })
    });

    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});


server.listen(port, function () {
    console.log('Server is running on: ' + port);
});