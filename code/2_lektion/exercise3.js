class MsgBoard {
    constructor(name) {
        this.name = name; 
        this.msgs = [];
        this.members = [];
    }

    putMsg(str) {
        this.msgs.push(str);
    }

    printMsgs() {
        for (let msg of this.msgs) {
            console.log(msg);
            this.sendAndNotify(msg);
        }
    }

    register(name) {
        this.members.push(name);
    }

    sendAndNotify(msg) {
        for (let member of this.members) {
            console.log(`${member}, a message from ${this.name}: ${msg}`);
        }
    }
}

let board = new MsgBoard("board");

board.register("Bob");
board.register("Alice");

board.putMsg("Hej, detter er en test");
board.putMsg("dette er endnu en test");
board.putMsg("dette er den sidste test");

board.printMsgs();
