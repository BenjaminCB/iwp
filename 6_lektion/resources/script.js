
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

// document.addEventListener("mousemove", (event) => {
//     console.log(event.target.nodeName); 
// });
