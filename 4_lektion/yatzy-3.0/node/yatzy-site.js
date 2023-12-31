import {NUM_ROUNDS, playRound, roll, isSpecialRound, newScoreBoard} from "./yatzy-game.js"
export {yatzyHomePage, newYatzyGamePage, newYatzyRoundPage, validateYatzyConfigData,
        validateYatzyRoundData, validateYatzyHighScoreData, 
        yatzyHighScorePage, VALIDATION_ERROR}

/* *****************************************************************
  DISCLAIMER: This code is developed to support education and demo 
  purposes and certain simplifications have been made to keep the code
  short(ish) and comprehensible.
  ****************************************************************** */

  /* **************************************************************************** *
  The first series of functions are called by the server module as result of HTTP
  communication with the client. Data is transfered to this "application" module, it two steps,
  First the raw forms data is sent to a validator functions that retun a validate data-object with the forms data.
  Then, the validated data is forwarded to a function that computes the actual client response (HTML page). 
  * ******************************************************************************** */

const VALIDATION_ERROR = "Validation Error";


//constants for validating input from the network client
const MAX_DICE_COUNT = 20;
const MIN_DICE_COUNT = 5;
const MIN_NAME_LEN = 1;
const MAX_NAME_LEN = 30;


//Called by the server when it has received the Yatzy Game config. form
//It must validate the included forms data and return an object with valid data. 
//gameFormData is an instance of "URLSearchParams", se chap 9.11 
function validateYatzyConfigData(gameFormData) {
    let playerName;
    let playerNameLen;
    let diceCount;
    let imgOrNum;

    //ensure that data contains the right fields
    if (gameFormData.has("name") && gameFormData.has("diceCount")) {
        playerName = gameFormData.get("name");
        playerNameLen = playerName.length;
        diceCount = Number(gameFormData.get("diceCount"));
        imgOrNum = gameFormData.get("imgOrNum");
        //and right values
        if ((playerNameLen >= MIN_NAME_LEN) && (playerNameLen <= MAX_NAME_LEN) &&
           (diceCount >= MIN_DICE_COUNT) && (diceCount <= MAX_DICE_COUNT) ) {
            //strip other fields from the form
            let gameData = {name: playerName, diceCount: diceCount, mode: imgOrNum}; 
            return gameData;
        }
    }

    //anything else: No Go! 
    throw(new Error(VALIDATION_ERROR));
}

//Called by the server when it has received the Yatzy Round form
//TODO: decrypt gameID
//gameFormData is an instance of "URLSearchParams", se chap 9.11 
function validateYatzyRoundData(roundFormData) {
    //gameID should be encrypted
    if (roundFormData.has("gameID")) {
        let roundData = {gameID: Number(roundFormData.get("gameID"))};
        let game = yatzyController.getGame(roundData.gameID);

        if (game && !game.gameOver()) {
            return roundData;
        }
    }
    //any other case: no go! 
    throw(new Error(VALIDATION_ERROR));
}

//Called by the server when it has received a GET on the "/" resource
//It is expected to produce an HTML "front page" for the game
function yatzyHomePage() {
    let page = yatzyController.emptyGame.printGameFormHTML();
    return page; 
}

//Called by the server after the "new game config" form has been validated
//ie, it transfers the validate gameData object produced by the validator function
//The function is expected to return an HTML page with the scoreboard and functionality to play a next round
function newYatzyGamePage(gameData) {
    let game = yatzyController.newYatzyGame(gameData);
    game.start(); 
    let page = game.printRoundFormHTML();
    return page;
}

//Called by the server when a request for a new round has been issued (after the from has been validated)
//It is expected to produce an HTML File with the results from playing a round.
function newYatzyRoundPage(roundData) {
    let gameID = roundData.gameID;
    let game = yatzyController.getGame(gameID);
    game.playRound();
    let page = game.printRoundFormHTML();
    return page;
}

//called by the server when the user has requested the highscore
//TODO
function validateYatzyHighScoreData(formsData) {
    //Validate
    let data = {filter: formsData.get("filter")};
    return data;
}

//called by the server when the user has requested the highscore (after validation)
//It is to return a complete HTML page with the high-score contents.  
//TODO
function yatzyHighScorePage(validatedData) {
    let hdr = printHTMLHdr("Yatzy - Highscores", ["css/style.css"]);
    let highscores = yatzyController.gamesSummary();
    let filter = [...highscores];
 
    if (validatedData.filter != "all") {
        filter = highscores.filter(game => game.name === validatedData.filter);
    }

    let table = `
    <table id="scoretable">
        <caption> Yatzy - Highscores </caption>
        <thead>
            <tr>
            <th> Name </th>
            <th> Score </th>
            </tr>
        </thead>`;

    for (let game of filter) {
        let c1 = printTableCellHTML("class=\"left-text\"", game.name);
        let c2 = printTableCellHTML("class=\"right-text\"", game.score);
        table += printTableRowHTML("", c1 + c2);
    };

    table += "</table>\n";

    let options = function() {
        let o = "";
        let seen = [];
        for (let game of highscores) {
            if (seen.includes(game.name)) {
                continue;
            } else {
                o += `<option name="${game.name}">${game.name}</option>\n`;
                seen.push(game.name);
            }
        }
        return o;
    };

    let dropdown = `
    <form action="/highscores" method="post">
        <select name="filter">
            <option value="all">All</option>
            ${options()}
        </select>
        <button type"submit">Filter</button>
    </form>`;

    let body = dropdown + table + printAnchorSection(["Home", "Help"], ["/", "html/help.html"]);
    body = printHTMLBody(body);
    let page = hdr + body;
    return page;
}

/* **************************************************************************** *
     The Yatzy Controller tracks the state of all games in the system: past and ongoing.
     It also assigns gameIDs to new games. It creates a YatzyGame object for each game.
     These are stored in the games array "database"
 * ******************************************************************************** */

//This object maintains the state of the (multiple) games of the server
//The state of a single game is maintained bu a game object constructed by the "YatzyGame" function
let yatzyController = {
    games: [],   //"DB" for storeing the ongoing and past games
    emptyGame: new YatzyGame(-1, "Player", 5), //to be able to generate an empty scoreboard HTML page.

    hasGame: function(gameID) {
        return (gameID >= 0 && gameID < this.games.length && this.getGame(gameID));
    },

    //looksup game by gameID
    getGame: function(gameID) {
        return this.games[gameID];
    },

    //initiates a new game; allocate empty game and assign gameID; store in DB
    newYatzyGame: function (gameData) {
        let gameID = this.games.length;
        let game = new YatzyGame(gameID, gameData.name, gameData.diceCount, gameData.mode);
        this.games[gameID] = game;
        return game;
    },

    gamesSummary() {
        let summary = [];

        for (let i = 0; i < this.games.length; i++) {
            summary[i] = {name: "", score: 0};
            summary[i].name = this.games[i].name;
            let score = this.games[i].scoreTable[17].score;
            summary[i].score = score === 0 ? 0 : 5 * score / this.games[i].diceCount;
        };

        summary.sort((a, b) => b.score - a.score);

        return summary;
    }
}

/* **************************************************************************** *
  This YatzyGame constructor function creates objects that tracks the state of a game. 
  GameID is the assigned gameID, name is playerName, diceCount the number of dice used in this game
  It uses the yatzy-game module to imlement the core score counding and dice tossing.
  The length part is what produces the HTML of the scoreboard and forms.
  * ******************************************************************************** */

function YatzyGame(gameID, name, diceCount, mode) {
    this.gameTitle = "IWP Multi Yatzy";
    this.gameID = gameID;
    this.name = name;
    this.mode = mode;
    this.diceCount = diceCount;
    this.roundNo = 0;  //the next round to play
    this.scoreTable = newScoreBoard();
    this.gameOn = false; //game has not been started yet. 
    this.gameOver = function() { //if all rounds have been played, stop the game
        return (this.roundNo >= NUM_ROUNDS)
    }; 
    this.start = function() {
        this.gameOn = true;
    };

    //play the next round as indicated by playRound. 
    //this implementation only allows the game to be played sequentially from top to button
    this.playRound = function() {
        console.log("playing:" + this.roundNo);

        //skip over special rounds of the scoreboard
        let r = roll(this.diceCount);  
        playRound(this.scoreTable, this.roundNo, r);

        this.roundNo++;

        while (isSpecialRound(this.roundNo) && !this.gameOver()){
            this.roundNo++; 
        }
    };

    //A series of yatzy game (score table) specific functions form HTML'ifying the scoreboard
    //Print table header and caption
    this.printScoreTableHdrHTML = function() {
        let res=`
        <caption> Yatzy Scores </caption>
        <thead><tr> <th colspan="3"> ${this.name} </th></tr>
        <tr> <th> Round Name </th> <th> Dice </th> <th> Score </th></tr>
        </thead>`;
        return res;
    };


    //generates the HTML code for the play scores table, assumed to be complete.
    this.printScoresHTML = function() {
        //Print table header and caption
        let res = `<table id="scoretable" ${(this.gameOn)?"":"class=\"greyed\""}> \n`;
        res += this.printScoreTableHdrHTML();

        let rows = "";

        //print the table body, one row at a time
        for (let round = 0; round < this.scoreTable.length; round++) {
            let row = "";

            //and one column at a time, first "round name"
            let clmn1 = printTableCellHTML("class=\"left-text\"", this.scoreTable[round].roundName);

            let c2 = "";   //contents cell2

            //then the actual dice roll, if any (special rounds do not have a roll)
            if (!isSpecialRound(round)) {
                c2 += "<span>";
                for (let d = 0; d < this.scoreTable[round].diceRoll.length; d++){
                    console.log("here");
                    console.log(mode);
                    if (this.mode === "num") {
                        c2 += String(this.scoreTable[round].diceRoll[d]) + " ";                      
                    } else {
                        c2 += `<img src="img/${this.scoreTable[round].diceRoll[d]}-dice.png" width="20" height="20" alt="dice ${this.scoreTable[round].diceRoll[d]} ">`;
                    }
                }
                c2 += "</span>";
            }

            let clmn2 = printTableCellHTML("", c2);

            //finally the score column
            let clmn3 = printTableCellHTML("class=\"right-text\"", this.scoreTable[round].score);

            if (isSpecialRound(round)) {
                row += printTableRowHTML("class=\"row-fill\"", clmn1 + clmn2 + clmn3);
            } else {
                row += printTableRowHTML("", clmn1 + clmn2 + clmn3);
            }

            rows += row;
        }

        res += printTableBodyHTML("", rows); //add BODY start/end tags
        return res;
    };

    //Function to render the two forms of the page: game configuration, and the game-state itself.
    this.printGameFormHTML = function () {
        let gameConfigFormHTML = `
        <h1> ${this.gameTitle}</h1>
        <form action="/newgame" method="post">
            <fieldset>
            <legend>Configure Game:</legend>
            <div class="myFormLayout">
                <label for="name_id"> Name</label>
                <input type="text" id="name_id" name="name" placeholder="Navn" autofocus required minlength="1" maxlength="30"> 
                <label for="diceCount_id"> Number of Dice:</label> 
                <input type="number" id="diceCount_id" name="diceCount" placeholder="5" min="5" max="20" required>
                <label for="mode"> Image or number:</label>
                <select id="mode" name="imgOrNum">
                    <option value="num">Num</option>
                    <option value="image">Images</option>
                </select>
                <input type="submit"  value="New Game">
            </div>
            </fieldset>
        </form>`;
        gameConfigFormHTML += printAnchorSection(["Highscores", "Help"], ["/highscores", "html/help.html"]);
        let page = printHTMLHdr("IWP Yatzy Game", ["css/style.css"]);
        page += printHTMLBody(gameConfigFormHTML);
        return page;
    }

    this.printRoundFormHTML = function(){
        let scoreTableHTML = this.printScoresHTML();
        let newRoundFormHTML = `
        <h1> ${this.gameTitle}</h1>
        <form id="gameControl_id"  action="/nextround" method="post">
            <fieldset>
            <legend>Play Game:</legend>

            <input type="text" name="gameID" value="${this.gameID}" style="display:none" required minlength="1" maxlength="30">
            <input type="submit" value="Next Round" ${(this.gameOn && !this.gameOver()) ? "" : "disabled"}>
            <output>
                ${scoreTableHTML}
            </output>
            </fieldset>
        </form>\n`;
        newRoundFormHTML += printAnchorSection(["Home","Highscores", "Help"], ["/","/highscores", "html/help.html"]);
        let page = printHTMLHdr("IWP Yatzy Game", ["css/style.css"]);
        page += printHTMLBody(newRoundFormHTML);
        return page;
    };

}

/* *************************************************************************************
A set of general functions to generate a basic HTML page and table
  *************************************************************************************** */
function printTableBodyHTML(attr, code) {
    return `<tbody ${attr}>\n\t ${code} </tbody>\n`;
}
  
function printTableRowHTML(attr, code) {
    return `<tr ${attr}> ${code} </tr>\n`;
}
  
function printTableCellHTML(attr, code) {
    return `<td ${attr}> ${code} </td>\n`;
}


//The page needs a HTML header with a suitable title
//Optionally, allows css files and in-header scipts to be added
function printHTMLHdr(title, csss = [], scripts = []) {
    let cssString = "";
    for (let i = 0; i < csss.length; i++) {
        let css = csss[i];
        cssString += `${css === "" ? "" : "<link rel=\"stylesheet\" href=\""+css+"\">\n"}`;
    } 

    let scriptString = "";
    for(let i = 0; i < scripts.length; i++) {
        let script = scripts[i];
        scriptString += `${script === "" ? "" : "<script defer src=\""+script+"\"></script>\n"}`;
    } 

    let str = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>${title}</title>
        <meta charset="utf-8">
        ${cssString}
        ${scriptString}
    </head>`;

    return str;
}


//The page needs a body, with html contents given in body parameter
//Optionally, allows a set of ES6 modules (type attribute=module)to be loaded as well at the end of the body
function printHTMLBody(body, scripts = []) {
    let scriptString = "";
    for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i];
        scriptString += `${script === "" ? "" : "<script type=\"module\" src=\""+script+"\"></script>\n"}`;
    } 

    let str = `
    <body>
        ${body}
        ${scriptString}
    </body>
    </html>`;

    return str;
}

function printAnchorSection(descriptions, refs) {
    let str = `<h2>Links</h2>\n\t<ul>\n\t`;

    for (let i = 0; i < descriptions.length; i++) {
        str += `\t<li><a href="${refs[i]}">${descriptions[i]}</a></li>\n\t`; 
    };

    str += `</ul>`;

    return str;
}
