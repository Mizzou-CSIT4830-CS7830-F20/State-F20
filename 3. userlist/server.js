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
    
    // Server tell the client who's already here 
    io.to(socket.id).emit("updateClient", clients); 
    
    // add a new spot for the new client 
    clients[socket.id] = "noname"; 
        
    socket.on("disconnect", function() {
        console.log(clients[socket.id] + " disconnected");
        
        // remove the client from server's memory 
        delete clients[socket.id]; 
        
        // tell the other clients that there's been an update 
        socket.broadcast.emit("updateClient", clients); 
    });

    socket.on("join", function(user) {
        console.log(user + " joined in");
        
        // client reports that it's joined 
        clients[socket.id] = user;
        
        // server tells other clients that a new user has joined 
        socket.broadcast.emit("updateClient", clients); 
    });
});
