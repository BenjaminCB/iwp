let webSocketServer = require('websocket').server;
let http = require('http');
let webSocketsServerPort = 3000;
let server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

let wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', (request) => {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    let connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.sendUTF(JSON.stringify({ 'message' : 'some data'} ));

    connection.on('message', function(message) {
        console.log(JSON.stringify(message));
    });
});
