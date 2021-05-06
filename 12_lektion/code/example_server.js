const net = require('net');
const fs = require('fs');

const lastMod = fs.statSync("./example_server.js").mtime;

let html =
`<html>
<body>
<h1>Hello, World!</h1>
</body>
</html>
`;

let header =
`HTTP/1.1 200 OK
Date: ${Date()}
Server: ArchLinux
Last-Modified: ${lastMod}
Content-Length: ${html.length}
Content-Type: text/html
Connection: Closed
`;
// Date: Mon, 27 Jul 2009 12:28:53 GMT
// Last-Modified: Wed, 22 Jul 2009 19:15:56 GMT

const server = net.createServer((socket) => {
	client_address = socket.address();
	console.log("%s:%d connected", client_address.address, client_address.port);

	socket.end(header + "\n" + html);
});

server.listen(9999);
