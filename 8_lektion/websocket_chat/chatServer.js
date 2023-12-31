const http = require("http");
const webSocketServer = require('websocket').server;
const fs = require("fs");
const url = require("url");

const clientHTML = fs.readFileSync("chatClient.html");

let connections = [];

let server = new http.Server();
server.listen(3000);

let wsServer = new webSocketServer({
    httpServer: server
});

server.on("request", (req, res) => {
    let pathname = url.parse(req.url).pathname;
    if (pathname === "/") {
        res.writeHead(200, {"Content-Type": "text/html"}).end(clientHTML);
    } else {
        res.writeHead(404).end();
    }
});

wsServer.on('request', (req) => {
    console.log((new Date()) + ' Connection from origin ' + req.origin + '.');
    let connection = req.accept(null, req.origin);
    connections.push(connection);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', msg => {
        // console.log(JSON.stringify(msg));
        connections.forEach(c => c.sendUTF( JSON.stringify(msg) ));
    });
});
