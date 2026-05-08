const ingreso = document.getElementById("formularioIngreso");
const registro = document.getElementById("formularioRegistro");

function pagIngresar() {
    ingreso.classList.remove("hide");
    registro.classList.add("hide");
}

function pagRegistrar() {
    ingreso.classList.add("hide");
    registro.classList.remove("hide");
}