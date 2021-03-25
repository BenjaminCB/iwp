
form.addEventListener("input", (event) => {
    let select = document.querySelector("#beerSelect");
    let val = event.target.value;
    select.replaceWith(makeSelect(beerTypes[val], "beerSelect"));
});

button.addEventListener("click", (event) => {
    radioValues(event.target.parentElement);
});

function radioValues(field) {
    for (let child of field.children) {
        if (child.type === "radio") {
            console.log(`${child.value}: ${child.checked}`);
        }
    }
}

let previous = "";
document.body.addEventListener("mousemove", (event) => {
    if (event.target.nodeName !== previous) {
        let url = window.location.href;
        fetch(url + "track", {
            method: 'POST',
            headers: {
                'Content-Type': 'text/html'
            },
            body: event.target.id
        })
        .then(res => {
            console.log(res.status);
        });
        previous = event.target.nodeName;
    }
});
