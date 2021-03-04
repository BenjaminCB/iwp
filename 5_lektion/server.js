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

app.post("/", (req, res) => {
    playGame(req.body.val);
    res.sendFile(__dirname + "/scores.html");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


