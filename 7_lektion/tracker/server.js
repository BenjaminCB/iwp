"use strict";
//make use of file system module
//Note that we use EC6 modules!
//You may need to add this to the package.json file when using EC6 modules: "type": "module",
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
const __dirname = path.resolve();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use("/static", express.static('resources'));
app.use("/static", express.static('css'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/resources/index.html");
});

app.get("/beers.json", (req, res) => {
    res.sendFile(__dirname + "/resources/beers.json");
});

app.get("/wait", (req, res) => {
    res.sendFile(__dirname + "/resources/exercise2.html");
});

app.get("/image", (req, res) => {
    res.sendFile(__dirname + "/resources/images.html");
});

app.get("/image/cat", (req, res) => {
    res.sendFile(__dirname + "/resources/cat.png");
});

app.get("/cookie", (req, res) => {
    res.sendFile(__dirname + "/resources/cookie.html");
});

app.post("/track", (req, res) => {
    let body = "";
    req.on('data', chunk => {
        body += chunk;
    })
    req.on('end', () => {
        fs.appendFile("./track.txt", body + "\n", () => {
            console.log("could not append to file");
        })
        res.sendStatus(200);
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
