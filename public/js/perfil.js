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

// Activar función para cargar los personajes en la página
document.addEventListener("DOMContentLoaded", mostrarPersonajes);

