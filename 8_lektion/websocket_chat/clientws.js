let exampleSocket = new WebSocket('ws://127.0.0.1:3000/hello');

exampleSocket.onopen = function (event) {
    exampleSocket.send("Here's some text that the server is urgently awaiting!");
};

exampleSocket.onmessage = function (event) {
    console.log(event.data);
}
