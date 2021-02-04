
let diceRoll = [1, 6, 6, 2, 3, 4, 6];

findDices_v1(diceRoll, n => n <= 3);

function findDices_v1(arr, cmp) {
    let str = "";
    for (i of Object.keys(arr)) {
        if (cmp(arr[i])) {
            str += `${i}:${arr[i]},`;
        }
    };
    console.log(str);
}

function is6(n) {
    return n === 6;
}
