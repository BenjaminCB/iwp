let a = "hello";
let b = "world"; 
let c = "you  ";
let d = "htsn ";
let array = [a, b, c, d];
let strings=["Hejsa", "med", "dig!"];

console.log(avgStrLen(array));
console.log(avgStrLen(strings));

function avgStrLen(arr) {
    return arr.reduce((a, b) => a + b).length / arr.length;
}
