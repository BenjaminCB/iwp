let beerTypes = {ales: [], lagers: [], wilds: []};
getJSON("/beers.json").then(data => { 
    beerTypes.ales = data.ales;
    beerTypes.lagers = data.lagers;
    beerTypes.wilds = data.wilds;
});
// fetch('/beers.json')
//   .then((response) => {
//     return response.json()
//   })
//   .then((data) => {
//     // Work with JSON data here
//     beerTypes.ales = data.ales;
//     beerTypes.lagers = data.lagers;
//     beerTypes.wilds = data.wilds;
//   })
//   .catch((err) => {
//     // Do something for an error here
//   })

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
    return header;
}

function makeNav(names, links) {
    let nav = document.createElement("nav");
    for (let i = 0; i < names.length; i++) {
        let anchor = document.createElement("a");
        anchor.innerText = names[i];
        anchor.href = links[i];
        nav.append(anchor);
        nav.innerHTML += i + 1 === names.length ? "" : " |\n";
    };
    return nav;
}

async function getJSON(url) {
    let response = await fetch(url);
    let body = await response.json();
    return body;
};
