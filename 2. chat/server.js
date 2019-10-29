// Created by Professor Wergeles at the University of Missouri

var app = require('express')();
var http = require('http').Server(app);

var port = 8080;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});



http.listen(port, function(){
  console.log('listening on *:' + port);
});
