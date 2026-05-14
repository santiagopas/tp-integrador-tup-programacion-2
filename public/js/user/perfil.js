import {
	getCharacters,
	getUsers,
	saveUser,
	setActiveCharacterId,
} from '../db/db.js';

const getUserIdFromUrl = () => {
	const params = new URLSearchParams(window.location.search);
	const idParam = params.get('id');
	if (idParam) {
		return idParam;
	}

	const match = window.location.pathname.match(/perfil\.html\/([^/]+)/);
	return match ? decodeURIComponent(match[1]) : null;
};

const userIdFromUrl = getUserIdFromUrl();
const users = getUsers();
let datosUsuario = userIdFromUrl
	? users.find((user) => user.id === userIdFromUrl && user.isLogged)
	: null;

// Mostrar personajes en la página
const mostrarPersonajes = () => {
	const listado = document.getElementById('listadoPersonajes');
	listado.innerHTML = '';

	const personajes = getCharacters();

	personajes.forEach((personaje) => {
		const itemLista = document.createElement('li');
		itemLista.classList.add('personaje');

		// Nombre
		const nombre = document.createElement('div');
		nombre.classList.add('nomPer');
		nombre.innerHTML = `<strong>Nombre:</strong> ${personaje.name}`;

		// Clase
		const clase = document.createElement('div');
		clase.classList.add('claPer');
		clase.innerHTML = `<strong>Clase:</strong> ${personaje.class}`;

		// Nivel
		const nivel = document.createElement('div');
		nivel.classList.add('nivPer');
		nivel.innerHTML = `<strong>Nivel:</strong> ${personaje.classLevel}`;

		// Fecha creación
		const fecha = document.createElement('div');
		fecha.classList.add('fecPer');
		fecha.innerHTML = `<strong>Creado:</strong> ${personaje.createdAt}`;

		// Acciones
		const acciones = document.createElement('div');
		acciones.classList.add('acciones');

		const botonHojaPersonaje = document.createElement('button');
		botonHojaPersonaje.classList.add('botonMod', 'verHoja');
		botonHojaPersonaje.textContent = 'Ver hoja';

		botonHojaPersonaje.addEventListener('click', () => {
			setActiveCharacterId(personaje.id);
			const hojaUrl = new URL('./personaje-hoja.html', window.location.href);
			hojaUrl.searchParams.set('id', personaje.id);
			window.location.href = hojaUrl.toString();
		});

		const botonEliminar = document.createElement('button');
		botonEliminar.classList.add('botonMod', 'eliminar');
		botonEliminar.textContent = 'Eliminar';

		botonEliminar.addEventListener('click', () => {
			const confirmar = confirm(
				`¿Seguro que quieres borrar el personaje "${personaje.name}"?`,
			);
			if (confirmar) {
				let personajesGuardados = getCharacters();

				personajesGuardados = personajesGuardados.filter(
					(p) => p.id !== personaje.id,
				);

				localStorage.setItem('personajes', JSON.stringify(personajesGuardados));

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

const mostrarUsuario = () => {
	const nombreUsuario = document.getElementById('nomUsuario');
	const correoUsuario = document.getElementById('corUsuario');
	const nacimientoUsuario = document.getElementById('nacUsuario');
	const edadUsuario = document.getElementById('edaUsuario');
	const mensajeUsuario = document.getElementById('mensajeBienvenida');

	if (!datosUsuario) {
		if (mensajeUsuario) {
			mensajeUsuario.textContent = 'Inicia sesion para ver tu perfil.';
		}
		if (nombreUsuario) {
			nombreUsuario.textContent = 'N/A';
		}
		if (correoUsuario) {
			correoUsuario.textContent = 'N/A';
		}
		if (nacimientoUsuario) {
			nacimientoUsuario.textContent = 'N/A';
		}
		if (edadUsuario) {
			edadUsuario.textContent = 'N/A';
		}
		return;
	}

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

		if (Number.isNaN(nacim.getTime())) {
			return 0;
		}

		let edad = now.getFullYear() - nacim.getFullYear();
		const monthDiff = now.getMonth() - nacim.getMonth();

		if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < nacim.getDate())) {
			edad -= 1;
		}

		return edad;
	}

	edadUsuario.innerHTML = `${calculoEdad(datosUsuario.nacimiento)}`;
};

// Botón editar datos usuario

const activarEdicion = () => {
	if (!datosUsuario) {
		return;
	}
	const nombreUsuario = document.getElementById('nomUsuario');
	const correoUsuario = document.getElementById('corUsuario');
	const nacimientoUsuario = document.getElementById('nacUsuario');
	const edadUsuario = document.getElementById('edaUsuario');
	const acciones = document.querySelector('.acciones');

	nombreUsuario.innerHTML = `<input type="text" id="editNombre" value="${datosUsuario.nombre || ''}">`;
	correoUsuario.innerHTML = `<input type="email" id="editCorreo" value="${datosUsuario.correo || ''}">`;
	nacimientoUsuario.innerHTML = `<input type="date" id="editNacimiento" value="${datosUsuario.nacimiento || ''}">`;

	edadUsuario.parentElement.style.display = 'none';

	acciones.innerHTML = '';

	//Botón guardar cambios
	const botonGuardar = document.createElement('button');
	botonGuardar.textContent = 'Guardar';
	botonGuardar.classList.add('botonMod');
	botonGuardar.addEventListener('click', () => {
		const nuevoUsuario = {
			...datosUsuario,
			nombre: document.getElementById('editNombre').value,
			correo: document.getElementById('editCorreo').value,
			nacimiento: document.getElementById('editNacimiento').value,
		};
		saveUser(nuevoUsuario);
		datosUsuario = nuevoUsuario;
		mostrarUsuario();
		edadUsuario.parentElement.style.display = 'block';
		restaurarBotonEditar();
	});

	//Botón Cancelar
	const botonCancelar = document.createElement('button');
	botonCancelar.textContent = '✖';
	botonCancelar.classList.add('botonMod');
	botonCancelar.addEventListener('click', () => {
		mostrarUsuario();
		edadUsuario.parentElement.style.display = 'block';
		restaurarBotonEditar();
	});

	acciones.appendChild(botonGuardar);
	acciones.appendChild(botonCancelar);
};

// Restaurar botón después de editar
const restaurarBotonEditar = () => {
	const acciones = document.querySelector('.acciones');
	acciones.innerHTML = '';
	const botonEditar = document.createElement('button');
	botonEditar.textContent = '✏️';
	botonEditar.classList.add('botonMod');
	botonEditar.addEventListener('click', activarEdicion);
	acciones.appendChild(botonEditar);
};

document.addEventListener('DOMContentLoaded', () => {
	if (!datosUsuario) {
		window.location.replace('./index.html');
		return;
	}
	const crearPersonajeButton = document.getElementById('crearPersonaje');
	if (crearPersonajeButton) {
		const createUrl = new URL(
			'./crear-personaje-form.html',
			window.location.href,
		);
		createUrl.searchParams.set('id', datosUsuario.id);
		crearPersonajeButton.onclick = () => {
			window.location.href = createUrl.toString();
		};
	}
	mostrarUsuario();
	mostrarPersonajes();
	restaurarBotonEditar();
});
