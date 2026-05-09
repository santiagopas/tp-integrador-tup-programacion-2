//validación ingreso

const alertError = document.getElementById("errorDatosIngreso");
const ingresar = document.getElementById("botonIngreso");

const renderError = (text) => {
    alertError.textContent = text;
    setTimeout(() => {
        alertError.textContent = null;
    }, 3000);
};

ingresar.addEventListener("click", () => {

    const usuarioStorage = JSON.parse(localStorage.getItem("usuario"));

    const correoLogin = document.getElementById("correoLogin").value;
    const contraLogin = document.getElementById("contraLogin").value;

    const correoUsuario = usuarioStorage.correo;
    const contraUsuario = usuarioStorage.contra;

    if(correoLogin !== correoUsuario) {
        document.getElementById("contraLogin").value = "";
        return renderError("El correo electrónico ingresado no es correcto, intente nuevamente");
        
    }

    if(contraLogin !== contraUsuario) {
        document.getElementById("contraLogin").value = "";
        return renderError("La contraseña ingresada no es correcta, intente nuevamente");
    }

    if(correoLogin === correoUsuario && contraLogin === contraUsuario) {
        window.location.href = "./perfil.html"
    }

});
