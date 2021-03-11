let urls = [];
for (i = 0; i < 100; i++) {
    urls[i] = "/image/cat";
};
let promises = urls.map(url => getImage(url));

// timer(imagesAtOnce);
function imagesAtOnce() {
    Promise.all(promises).then(imgs => {
        for (img of imgs) {
            document.body.prepend(img);
        }
    });
}

imagesOneAtTheTime();
async function imagesOneAtTheTime() {
    let t1 = new Date();

    for await (img of promises) {
        document.body.prepend(img);
    };

    let t2 = new Date();
    console.log(t2 - t1);
}

function timer(func, ...args) {
    let t1 = new Date();
    func(...args); 
    let t2 = new Date();
    console.log(t2 - t1);
}
async function getImage(url) {
    let res = await fetch(url);
    let blob = await res.blob();
    let image = URL.createObjectURL(blob);
    let element = document.createElement("img");
    element.src = image;
    return element;
};
