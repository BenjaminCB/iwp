let form = document.querySelector("#beerForm");
let button = document.querySelector(`#beerForm input[type="button"]`);

form.addEventListener("input", (event) => {
    radioValues(form.children[0]);
});

button.addEventListener("click", (event) => {
    radioValues(button.parentElement);
});

function radioValues(field) {
    for (let child of field.children) {
        if (child.type === "radio") {
            console.log(`${child.value}: ${child.checked}`);
        }
    }
}

document.addEventListener("mousemove", (event) => {
    console.log(event.target.nodeName); 
});
