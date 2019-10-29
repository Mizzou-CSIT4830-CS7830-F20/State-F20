// Created by Professor Wergeles at the University of Missouri

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var port = 8000;

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


var state = {
    started: false,
    health: 0,
    players: {},
    baddies: []
};

io.on("connection", function(socket) {
    console.log("A user (" + socket.id + ") connected");
    
    // When a player joins...
    socket.on("join", function(player) {
        console.log(player.name + " joined the game!");
        
        state.players[socket.id] = player;
        
        
        io.sockets.emit("updatePlayers", state.players);
        
        
        if (Object.keys(state.players).length == 1) {
            
            io.to(socket.id).emit("isHost");
        }
        
        // Check if the game has already started
        if (state.started) {
            io.to(socket.id).emit("startGame", state);
        }
    });
    
    // If a client disconnects
    socket.on("disconnect", function() {
        console.log(state.players[socket.id].name + " disconnected");
        
        
        delete state.players[socket.id];
        
        // Tell the other clients that there's been an update
        socket.broadcast.emit("updatePlayers", state.players);
    });
    
    // If the host sets up a new game...
    socket.on("setupGame", function(props) {
        // Setup fort health
        state.health = props.health;
        
        // Remember the baddies
        state.baddies = props.baddies;
        
        
        state.started = true;
        io.sockets.emit("startGame", state);
    });
    
    // When the host's baddies move...
    socket.on("updateBaddies", function(baddies) {
    	
        state.baddies = baddies;
        
        socket.broadcast.emit("updateBaddies", state.baddies);
    });
    
      
    
});