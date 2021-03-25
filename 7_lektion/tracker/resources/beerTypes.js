let beerTypes = {ales: [], lagers: [], wilds: []};
getJSON("/beers.json").then(data => {
    beerTypes.ales = data.ales;
    beerTypes.lagers = data.lagers;
    beerTypes.wilds = data.wilds;
});

// fetch("https://htnsaoeu.dk/").catch((err) => {
//     console.log("failed fetch", err);
// });

// getJSON("/notajson.json").catch((err) => {
//     console.log("non existent json", err);
// });

getJSON("http://people.cs.aau.dk/~bnielsen/IWP/scores.json").catch((err) => {
    console.log(err);
});


let form = document.querySelector("#beerForm");
let select = makeSelect(beerTypes.ales, "beerSelect");
let button = document.querySelector(`#beerForm input[type="button"]`);

document.body.prepend(makeHeader("Choose functionality"), makeNav(["Choose", "Rate", "Search"], ["/", "/rate", "/search"]));
button.before(select);

function makeSelect(items, id) {
    let list = document.createElement("select");
    list.id = id;
    for (let item of items) {
        let option = document.createElement("option");
        option.text = item;
        option.value = item.toLowerCase().split(" ").join("_");;
        list.append(option);
    };
    return list;
}

function makeHeader(title) {
    let header = document.createElement("h1");
    header.innerText = title;
    header.id = title;
    return header;
}

function makeNav(names, links) {
    let nav = document.createElement("nav");
    for (let i = 0; i < names.length; i++) {
        let anchor = document.createElement("a");
        anchor.innerText = names[i];
        anchor.id = "link " + names[i];
        anchor.href = links[i];
        nav.append(anchor);
        nav.innerHTML += i + 1 === names.length ? "" : " |\n";
    };
    return nav;
}

async function getJSON(url) {
    let response = await fetch(url);

    if (!response.ok) {
        throw new Error("Not okay");
    }

    let type = response.headers.get("content-type");
    if (type !== "application/json") {
        throw new Error("Not a json file");
    }

    let body = await response.json();
    return body;
};
