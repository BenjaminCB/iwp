const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter the size of cheesboard: ", function(size) {
    chessboard(size);
    rl.close();
});

function chessboard(n) {
    let str = "";
    let bool = true;
    for (let i = 1; i <= n ** 2; i++) {
        if (bool) {
            str += "#";
        } else {
            str += " ";
        }

        bool = !bool;

        if (i % n === 0) {
            str += "\n";
            if (n % 2 === 0)
                bool = !bool;
        }
    };
    console.log(str);
}
