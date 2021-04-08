import http from 'http';
import fs from 'fs';
import url from 'url'

const clientHTML = fs.readFileSync('./quiz.html');

let clients = [];

let server = new http.Server();
server.listen(3000);

server.on("request", (req, res) => {
    let pathname = url.parse(req.url).pathname;

    if (pathname === "/") {
        res.writeHead(200, {"Content-Type": "text/html"}).end(clientHTML);
    } else if (pathname === "/quiz" && req.method === "GET") {
        acceptNewClient(req, res);
    } else if (pathname === "/quiz/question" && req.method === "GET") {
        sendQuestion(req, res);
    } else if (pathname === "/quiz/answer" && req.method === "POST") {
        checkAnswer(req, res);
        // check answer add
        // respond
        // if correct add to broadcast new scoreboard
        // broadcastNewMessage(req, res);
    } else {
        res.writeHead(404).end();
    }
});

function acceptNewClient(req, res) {
    clients.push(res);

    req.connection.on("end", () => {
        clients.splice(clients.indexOf(res), 1);
        console.log("end");
        res.end();
    });

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache"
    });

    res.write("event: accepted\ndata: connected\n\n");
}

function sendQuestion(req, res) {
    let rnd = Math.trunc( 3 * Math.random() );
    let json = fs.readFileSync("./questions/" + rnd + ".json");
    let q = JSON.parse(json);

    res.writeHead(200, {"Content-Type": "application/json"}).end(JSON.stringify(q));
}

async function checkAnswer(req, res) {
    let data = "";
    req.on("data", chunk => {
        data += chunk;
    });

    req.on("end", () => {
        let answer = JSON.parse(data);
        let correct = fs.readFileSync(`./questions/${answer.number}.json`);
        if (answer.answer == correct.answer) {
            newScore(answer, "CORRECT!");
        } else {
            newScore(answer, "WRONG!");
        }
    });
}

function newScore(person, end) {
    let msg = person.nick + " answered question " + person.number + " " + end;
    let event = `event: scoreboard\n${msg}\n\n`;

    console.log(event);
    clients.forEach(c => c.write(event));
}

async function broadcastNewMessage(req, res) {
    req.setEncoding("utf8");
    let body = "";
    for await (let chunk of req) {
        body += chunk;
    };

    res.writeHead(200).end();

    let msg = "data: " + body.replace("\n", "\ndata: ");
    let event = `event: scoreboard\n${msg}\n\n`;

    clients.forEach(c => c.write(event));
};
