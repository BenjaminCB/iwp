
//We use EC6 modules!
import {extractJSON, fileResponse, htmlResponse,extractForm,jsonResponse,errorResponse,reportError,startServer} from "./server.js";
const ValidationError="Validation Error";
const NoResourceError="No Such Resource";
export {ValidationError, NoResourceError, processReq};

startServer();


/* ****************************************************************************
 * Application code for the BØVS application
 ***************************************************************************** */
function round2Decimals(floatNumber){
  return Math.round(floatNumber*100)/100;
 }

//constants for validating input from the network client
const maxScore=10;
const minScore=1;
const minNameLength=1;
const maxNameLength=30;
const minBeerLength=1;
const maxBeerLength=30;

function calcHighscores(DB) {
    let scores = {};
    for (let beer of DB) {
        if (scores.hasOwnProperty(beer.evaluatorBeer)) {
            scores[beer.evaluatorBeer].score += beer.evaluatorScore;
            scores[beer.evaluatorBeer].evals++;
        } else {
            scores[beer.evaluatorBeer] = {
                score: beer.evaluatorScore,
                evals: 1
            }
        }
    };

    Object.keys(scores).forEach( key => {
        scores[key].score = scores[key].score / scores[key].evals;
    });

    return scores;
}


//function that validates the constraints of the beer evaluation Form
function validateEvalForm(beerEvaluationFormData){
    let evaluatorNameLen,
        evaluatorName,
        evaluatorBeer,
        evaluatorBeerLen,
        evaluatorScore;


    try {
        evaluatorNameLen = beerEvaluationFormData.evaluatorName.length;
        evaluatorName = beerEvaluationFormData.evaluatorName;
        evaluatorBeer = beerEvaluationFormData.evaluatorBeer;
        evaluatorBeerLen = evaluatorBeer.length;
        evaluatorScore = Number(beerEvaluationFormData.evaluatorScore);
    }
    catch(e) {
        console.log (e);
        throw (new Error(ValidationError));
    }

    if (evaluatorNameLen >= minNameLength && evaluatorNameLen <= maxNameLength &&
        evaluatorScore <= maxScore && evaluatorScore >= minScore &&
        evaluatorBeerLen <= maxBeerLength && evaluatorBeerLen >= minBeerLength) {
        let beerData = {
            evaluatorName: evaluatorName,
            evaluatorBeer: evaluatorBeer,
            evaluatorScore: evaluatorScore
        };
        return beerData;
    } else {
        throw(new Error(ValidationError));
    }
}


/* "Databases" emulated by maintained an in-memory arrays.
  One for the registered beer name, and one for  the evaluations.
   Higher index means newer data record: you can insert by simply 'push'ing new data records
*/
 let beersDB=[
    "Porse Guld",
    "Limfjords Porter",
    "Thy Økologisk Humle",
    "Fur Bock"
    ];
    function lookup(beerName){
      return beersDB.find(e=>e ===beerName)
    }

//insert some sample data
 let eval1={evaluatorName: "Mickey", evaluatorBeer:"Porse Guld", evaluatorScore:3};
 let eval2={evaluatorName: "Mouse", evaluatorBeer:"Porse Guld", evaluatorScore:7};
 let eval3={evaluatorName: "Mickey", evaluatorBeer:"Limfjords Porter", evaluatorScore:10};

let beerScoresDB=[
    eval1, eval2, eval3
];


console.log(calcHighscores(beerScoresDB));

//Adds information about a new evaluation to the database
//A record consist of validated form data.
function recordEvaluation(beerData){
  beerScoresDB.push(beerData);
  console.log(beerScoresDB);
  return new Date(); //return time of insert: not used in exercise.
}



/* *********************************************************************
   Setup HTTP route handling: Called when a HTTP request is received
   ******************************************************************** */
function processReq(req,res){
  console.log("GOT: " + req.method + " " +req.url);

  let baseURL = 'http://' + req.headers.host + '/';    //https://github.com/nodejs/node/issues/12682
  let url=new URL(req.url,baseURL);
  let searchParms=new URLSearchParams(url.search);
  let queryPath=decodeURIComponent(url.pathname); //Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string

  switch(req.method){
    case "POST": {
      let pathElements=queryPath.split("/");
      console.log(pathElements[1]);
       switch(pathElements[1]){
        case "beerEvaluations":
          extractJSON(req)
          .then(beerEvaluationFormData => validateEvalForm(beerEvaluationFormData))
          .then(beerData => jsonResponse(res,recordEvaluation(beerData)))
          .catch(err=>reportError(res,err));
          break;
        default:
          console.error("Resource doesn't exist");
          reportError(res, NoResourceError);
        }
      }
      break; //POST URL
    case "GET":{
      let pathElements=queryPath.split("/");
      console.log(pathElements);
      //USE "sp" from above to get query search parameters
      switch(pathElements[1]){
        case "": //
           fileResponse(res,"/html/bovs.html");
           break;
        case "date":{ //
          let date=new Date();
          console.log(date);
          jsonResponse(res,date);
        }
        break;
        case "scores":
              jsonResponse(res, calcHighscores(beerScoresDB));
              break;
        default: //for anything else we assume it is a file to be served
           fileResponse(res, req.url);
         break;
      }//path
    }//switch GET URL
    break;
    default:
     reportError(res, NoResourceError);
  } //end switch method
}


