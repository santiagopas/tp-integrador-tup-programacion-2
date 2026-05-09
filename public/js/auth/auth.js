const ingreso = document.getElementById("formularioIngreso");
const registro = document.getElementById("formularioRegistro");

function pagIngresar() {
    ingreso.classList.remove("formularioInvisible");
    ingreso.classList.add("formularioVisible");
    registro.classList.remove("formularioVisible");
    registro.classList.add("formularioInvisible");
}

function pagRegistrar() {
    ingreso.classList.add("formularioInvisible");
    ingreso.classList.remove("formularioVisible");
    registro.classList.add("formularioVisible");
    registro.classList.remove("formularioInvisible");
}

const alertError = document.getElementById("errorDatosRegistro");
const registrar = document.getElementById("botonRegistro");

registrar.addEventListener("click", () => {

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const nacimiento = document.getElementById("nacimiento").value;
    const contra = document.getElementById("contra").value;
    const validar = false;
    alertError.textContent = null;

    const usuario = {
        nombre,
        correo,
        nacimiento,
        contra
    };

    for (var i = 0; i < 3; i++) {
        if (usuario[i] == null) {
            alertError.textContent = "Asegurese de llenar todos los campos";
        }
    }

    function validarContra(contra) {
        const simbolos = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
        return simbolos.test(contra);
    }

    if (validar == true) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
    }
});