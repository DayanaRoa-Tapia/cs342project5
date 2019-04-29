//TCP version

//var net = require('net');
var http = require('http');
var HOST = '127.0.0.1';
var PORT = 3000;

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
});


//Add close event handler for the client socket
client.on('close', function(){

    console.log('Connection closed');

});



//TLS version
var tls = require('tls');
var fs = require('fs');
var HOST = 'localhost';
var PORT = 3000;


var options = { ca: [ fs.readFileSync('./cert.pem') ] };

var client = tls.connect(PORT, HOST, options, function() {
    if (client.authorized) {
        
        console.log('CONNECTED AND AUTHORIZED\n');
        
        client.on('close', function() {
            console.log('SOCKET CLOSED\n');
            process.exit();
        });
        
        process.stdin.pipe(client);
        process.stdin.resume();
        
        //Make some request to the server
        client.write('GET /hey HTTP/1.1\r\n');
        client.write('\r\n');
        
        client.write('POST /ho HTTP/1.1\r\n');
        client.write('\r\n');
    }
    else {
        console.log('AUTH FAILED\n');
        process.exit();
    }
});


client.setEncoding('utf8');
client.on('data', function(data) {
    console.log('-------------');
    console.log(data);
});
