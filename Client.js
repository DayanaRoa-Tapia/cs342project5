var net = require('net');
var http = require('http');
var HOST = '127.0.0.1';
var PORT = 5555;

var client = new net.Socket();

client.connect(PORT, HOST, function(){

    console.log('CONNECTED to port : ' + PORT);
    client.write();  //The thing we need to write to the server
});

//Add data event handler for the client socket
//Data is what the server sent to this socket
client.on('data', function(data){

    console.log(); //What server sent to the client

    //Close the client socket
    client.destroy();
}


//Add close event handler for the client socket
client.on('close', function()){

    console.log('Connection closed');

}