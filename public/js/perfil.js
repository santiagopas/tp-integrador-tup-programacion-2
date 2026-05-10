import { getCharacters, getCharacterById } from './db/db.js';

// Mostrar personajes en la página
const mostrarPersonajes = () => {
    const listado = document.getElementById("listadoPersonajes");
    listado.innerHTML = "";

    const personajes = getCharacters();

    personajes.forEach((personaje) => {
        const itemLista = document.createElement("li");
        itemLista.classList.add("personaje");

        // Nombre
        const nombre = document.createElement("div");
        nombre.classList.add("nomPer");
        nombre.innerHTML = `<strong>Nombre:</strong> ${personaje.name}`;

        // Clase
        const clase = document.createElement("div");
        clase.classList.add("claPer");
        clase.innerHTML = `<strong>Clase:</strong> ${personaje.class}`;

        // Nivel
        const nivel = document.createElement("div");
        nivel.classList.add("nivPer");
        nivel.innerHTML = `<strong>Nivel:</strong> ${personaje.classLevel}`;

        // Fecha creación
        const fecha = document.createElement("div");
        fecha.classList.add("fecPer");
        fecha.innerHTML = `<strong>Creado:</strong> ${personaje.createdAt}`;

        // Acciones
        const acciones = document.createElement("div");
        acciones.classList.add("acciones");

        const botonHojaPersonaje = document.createElement("button");
        botonHojaPersonaje.classList.add("botonMod");
        botonHojaPersonaje.textContent = "📝";

        const botonEliminar = document.createElement("button");
        botonEliminar.classList.add("botonMod");
        botonEliminar.textContent = "❌";

        botonEliminar.addEventListener("click", () => {
            const confirmar = confirm(`¿Seguro que quieres borrar el personaje "${personaje.name}"?`);
            if (confirmar) {
                let personajesGuardados = getCharacters();

                personajesGuardados = personajesGuardados.filter(p => p.id !== personaje.id);

                localStorage.setItem("personajes", JSON.stringify(personajesGuardados));

                mostrarPersonajes();
            }
        });



        acciones.appendChild(botonHojaPersonaje);
        acciones.appendChild(botonEliminar);

        // Agregar todo al <li>
        itemLista.appendChild(nombre);
        itemLista.appendChild(clase);
        itemLista.appendChild(nivel);
        itemLista.appendChild(fecha);
        itemLista.appendChild(acciones);

        listado.appendChild(itemLista);
    });
};

//mostrar datos usuario en pagina
let datosUsuario = JSON.parse(localStorage.getItem('usuario'));

const mostrarUsuario = () => {
    const nombreUsuario = document.getElementById("nomUsuario");
    const correoUsuario = document.getElementById("corUsuario");
    const nacimientoUsuario = document.getElementById("nacUsuario");
    const edadUsuario = document.getElementById("edaUsuario");
    const mensajeUsuario = document.getElementById("mensajeBienvenida");

    // Nombre
    nombreUsuario.innerHTML = `${datosUsuario.nombre}`;
    mensajeUsuario.innerHTML = `Bienvenido, ${datosUsuario.nombre}!`;

    // Correo
    correoUsuario.innerHTML = `${datosUsuario.correo}`;

    // Fecha Nacimiento
    nacimientoUsuario.innerHTML = `${datosUsuario.nacimiento}`;

    // Edad
    function calculoEdad(fechaNac) {

        const now = new Date();
        const nacim = new Date(fechaNac);

        let edad = 0;

        if (now.getMonth() < nacim.getMonth()) {
            edad = now.getFullYear() - nacim.getFullYear() - 1;
        }
        else {
            edad = now.getFullYear() - nacim.getFullYear();
        }

        return edad;
    };

    edadUsuario.innerHTML = `${calculoEdad(datosUsuario.nacimiento)}`;
};

// Botón editar datos usuario

const activarEdicion = () => {
    const nombreUsuario = document.getElementById("nomUsuario");
    const correoUsuario = document.getElementById("corUsuario");
    const nacimientoUsuario = document.getElementById("nacUsuario");
    const edadUsuario = document.getElementById("edaUsuario");
    const acciones = document.querySelector(".acciones");

    nombreUsuario.innerHTML = `<input type="text" id="editNombre" value="${datosUsuario.nombre || ""}">`;
    correoUsuario.innerHTML = `<input type="email" id="editCorreo" value="${datosUsuario.correo || ""}">`;
    nacimientoUsuario.innerHTML = `<input type="date" id="editNacimiento" value="${datosUsuario.nacimiento || ""}">`;

    edadUsuario.parentElement.style.display = "none";

    acciones.innerHTML = "";

    //Botón guardar cambios
    const botonGuardar = document.createElement("button");
    botonGuardar.textContent = "💾";
    botonGuardar.classList.add("botonMod");
    botonGuardar.addEventListener("click", () => {
        const nuevoUsuario = {
            nombre: document.getElementById("editNombre").value,
            correo: document.getElementById("editCorreo").value,
            nacimiento: document.getElementById("editNacimiento").value
        };
        localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
        datosUsuario = nuevoUsuario;
        mostrarUsuario();
        edadUsuario.parentElement.style.display = "block";
        restaurarBotonEditar();
    });

    //Botón Cancelar
    const botonCancelar = document.createElement("button");
    botonCancelar.textContent = "✖";
    botonCancelar.classList.add("botonMod");
    botonCancelar.addEventListener("click", () => {
        mostrarUsuario();
        edadUsuario.parentElement.style.display = "block";
        restaurarBotonEditar();
    });

    acciones.appendChild(botonGuardar);
    acciones.appendChild(botonCancelar);
};

// Restaurar botón después de editar
const restaurarBotonEditar = () => {
    const acciones = document.querySelector(".acciones");
    acciones.innerHTML = "";
    const botonEditar = document.createElement("button");
    botonEditar.textContent = "⚙️";
    botonEditar.classList.add("botonMod");
    botonEditar.addEventListener("click", activarEdicion);
    acciones.appendChild(botonEditar);
};


document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuario();
    mostrarPersonajes();
    restaurarBotonEditar();
});

