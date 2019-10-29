// Created by Professor Wergeles at the University of Missouri

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var port = 8080;

function handler(req, res) {
    fs.readFile("client.html", function(err, data) {
        if (err) {
            res.writeHead(500);
            res.end("Error loading client.html");
        }
        else {
            res.writeHead(200);
            res.end(data);
        }
    });
};

app.listen(port, function() {
    console.log("Running on port: " + port);
});


var clients = {};

io.on("connection", function(socket) {
    console.log("A user (" + socket.id + ") connected!");
    
    
        
    socket.on("disconnect", function() {
        console.log(clients[socket.id] + " disconnected");
    });

    socket.on("join", function(user) {
        console.log(user + " joined in");
    });
});
