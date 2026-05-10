//validación de formularios y localStorage

const alertError = document.getElementById("errorDatosRegistro");
const registrar = document.getElementById("botonRegistro");
const renderError = (text) => {
    alertError.textContent = text;
    setTimeout(() => {
        alertError.textContent = null;
    }, 3000);
};

registrar.addEventListener("click", () => {

    const id = window.crypto.randomUUID();
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const nacimiento = document.getElementById("nacimiento").value;
    const contra = document.getElementById("contra").value;
    const contraPrueba = document.getElementById("contraPrueba").value;
    var validar = false;
    alertError.textContent = null;

    function validarContra(contra) {
        const simbolos = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
        return simbolos.test(contra);
    }

    const usuario = {
        id,
        nombre,
        correo,
        nacimiento,
        contra
    };

    for (const i in usuario) {
        if (!usuario[i]) {
            return renderError("Asegúrese de llenar todos los campos");
        }
    }

    if (!correo.trim().includes("@")) {
        return renderError("Asegúrese de que el correo esté bien escrito");
    }

    if (!validarContra(contra)) {
        return renderError("Asegúrese que la contraseña contenga al menos una Mayúscula y un símbolo");
    }

    if (contra !== contraPrueba) {
        return renderError("Asegúrese que las contraseñas coincidan");
    }

    validar = true;

    if (validar) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        document.getElementById("registrado").textContent = "Registrado exitosamente! Redireccionando al ingreso...";
        setTimeout(() => {
            window.location.href = "./login.html";
        }, 3000);
    }
});

