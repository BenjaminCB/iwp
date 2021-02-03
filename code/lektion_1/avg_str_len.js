let a = "hello";
let b = "world"; 
let c = "you  ";
let d = "htsn ";
let array = [a, b, c, d];
let strings=["Hejsa", "med", "dig!"];

console.log(avgStrLen(array));
console.log(avgStrLen(strings));

function avgStrLen(arr) {
    let sum = 0;
    for (i of arr) {
        sum += i.length;
    };
    return sum /= arr.length;
}
