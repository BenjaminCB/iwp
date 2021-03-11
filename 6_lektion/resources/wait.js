async function promiseBased() {
    let p1 = await asyncMsg("Hej", 2000);
    console.log(p1);
    let p2 = await asyncMsg("iwp", 2000);
    console.log(p2);
    let p3 = await asyncMsg("i am done", 2000);
    console.log(p3);
}

function asyncMsg(msg, time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(msg);
        }, time);
    });
}
