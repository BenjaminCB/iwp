'use strict'
//SEE: https://javascript.info/strict-mode

let refresh = document.getElementById("refresh");

refresh.addEventListener("click", () => {
    jsonFetch("/scores").then(res => {
        console.log(res);
        let scoresArr = [];
        Object.keys(res).forEach(key => {
            scoresArr.push([key, res[key].score, res[key].evals]);
        })
        scoresArr.sort((a, b) => -1 * (a[1] - b[1]));

        let table = document.createElement("table");
        table.id = "hightscore"
        let header = `
        <tr>
            <th>Beer</th>
            <th>Score</th>
            <th>Evals</th>
        </tr>`;

        table.innerHTML += header;

        for (let beer of scoresArr) {
            let tr = `
            <tr>
                <th>${beer[0]}</th>
                <th>${beer[1]}</th>
                <th>${beer[2]}</th>
            </tr>`;
            table.innerHTML += tr;
        }

        document.getElementById("highscore").replaceWith(table);
    })
});

function jsonParse(response){
  if(response.ok)
     if(response.headers.get("Content-Type") === "application/json")
       return response.json();
     else throw new Error("Wrong Content Type");
 else
    throw new Error("Non HTTP OK response");
}

function jsonFetch(url){
  return  fetch(url).then(jsonParse);
}


function jsonPost(url = '', data={}){
  const options={
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
    };
  return fetch(url,options).then(jsonParse);
}

console.log("JS er klar!");

function extractBeerEvalData(){
    let beerEvalData = {};

    beerEvalData.evaluatorName = document.getElementById("name_id").value;
    beerEvalData.evaluatorBeer = document.getElementById("beer").value;
    beerEvalData.evaluatorScore = document.getElementById("score").value;

    console.log("Extracted");
    console.log(beerEvalData);

    return beerEvalData;
}

function sendEvalData(event) {
  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  document.getElementById("evaluateBtn_id").disabled=true; //prevent double submission
  let drinkData=extractBeerEvalData();

  jsonPost(document.getElementById("beerEvalForm_id").action,drinkData).then(evalStatus=>{
    console.log("Status="); console.log(evalStatus); //expect an date object.
    document.getElementById("evaluateBtn_id").disabled=false;
  }).catch(e=>console.log("Ooops "+e.message));
}

document.getElementById("beerEvalForm_id").addEventListener("submit", sendEvalData);
