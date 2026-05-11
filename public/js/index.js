import { getUser, saveUser } from './db/db.js';

const menuToggle = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('#theme-toggle img');
const menuIcon = menuToggle?.querySelector('img');
const brandIcon = document.querySelector('.navbar-brand img');
const themeStorageKey = 'theme';
// console.log('usuario global cargado: ', getUser());

const renderNavMenu = () => {
	const navMenu = document.getElementById('nav-menu');
	if (!navMenu) return;

	// Preserve theme toggle and mensajeBienvenida if they exist
	const themeToggleItem = navMenu.querySelector('#theme-toggle')?.closest('.nav-item');
	const mensajeBienvenidaItem = navMenu.querySelector('#mensajeBienvenida');

	navMenu.innerHTML = '';

	const user = getUser();

	if (user && user.isLogged) {
		if (mensajeBienvenidaItem) {
			navMenu.appendChild(mensajeBienvenidaItem);
		}

		const perfilItem = document.createElement('li');
		perfilItem.classList.add('nav-item');
		const perfilLink = document.createElement('a');
		perfilLink.href = `./perfil.html?id=${user.id}`;
		perfilLink.classList.add('nav-link');
		perfilLink.textContent = 'Perfil';
		perfilItem.appendChild(perfilLink);
		navMenu.appendChild(perfilItem);

		const cerrarItem = document.createElement('li');
		cerrarItem.classList.add('nav-item');
		const cerrarLink = document.createElement('a');
		cerrarLink.href = './index.html';
		cerrarLink.classList.add('nav-link');
		cerrarLink.textContent = 'Cerrar Sesión';
		cerrarLink.addEventListener('click', () => {
			user.isLogged = false;
			saveUser(user);
		});
		cerrarItem.appendChild(cerrarLink);
		navMenu.appendChild(cerrarItem);
	} else {
		const links = [
			{ href: './index.html', text: 'Inicio' },
			{ href: './registro.html', text: 'Registrarse' },
			{ href: './login.html', text: 'Iniciar sesión' }
		];

		links.forEach(linkInfo => {
			const item = document.createElement('li');
			item.classList.add('nav-item');
			const link = document.createElement('a');
			link.href = linkInfo.href;
			link.classList.add('nav-link');
			link.textContent = linkInfo.text;
			item.appendChild(link);
			navMenu.appendChild(item);
		});
	}

	if (themeToggleItem) {
		navMenu.appendChild(themeToggleItem);
	}
};

document.addEventListener('DOMContentLoaded', () => {
	renderNavMenu();
});

const updateMenuToggleState = () => {
	if (!menuToggle || !navMenu || !menuIcon) {
		return;
	}

	const isMenuOpen = navMenu.classList.contains('active');
	const isLightTheme = document.body.classList.contains('light-theme');

	if (isMenuOpen) {
		menuIcon.src = isLightTheme
			? './assets/icons/d10-dark.svg'
			: './assets/icons/d10-white.svg';
	} else {
		menuIcon.src = isLightTheme
			? './assets/icons/d20-dark.svg'
			: './assets/icons/d20-white.svg';
	}
	menuIcon.alt = isMenuOpen ? 'Cerrar menú' : 'Abrir menú';
	menuToggle.setAttribute('aria-expanded', String(isMenuOpen));
};

const updateThemeToggleState = () => {
	if (!themeToggle || !themeIcon) {
		return;
	}

	const isLightTheme = document.body.classList.contains('light-theme');
	themeIcon.src = isLightTheme
		? './assets/icons/moon.svg'
		: './assets/icons/sun.svg';
	themeIcon.alt = isLightTheme
		? 'Cambiar tema a oscuro'
		: 'Cambiar tema a claro';
	themeToggle.setAttribute(
		'aria-label',
		isLightTheme ? 'Cambiar tema a oscuro' : 'Cambiar tema a claro',
	);
	themeToggle.setAttribute('aria-pressed', String(isLightTheme));

	// actualizar iconos dependientes del tema
	updateBrandIconState();
	updateMenuToggleState();
};

const updateBrandIconState = () => {
	if (!brandIcon) return;
	const isLightTheme = document.body.classList.contains('light-theme');
	brandIcon.src = isLightTheme
		? './assets/icons/d20-dark.svg'
		: './assets/icons/d20-white.svg';
	brandIcon.alt = 'D20';
};

const applyStoredTheme = () => {
	const storedTheme = localStorage.getItem(themeStorageKey);
	document.body.classList.toggle('light-theme', storedTheme === 'light');
	updateThemeToggleState();
};

if (menuToggle && navMenu && menuIcon) {
	menuToggle.addEventListener('click', () => {
		navMenu.classList.toggle('active');
		updateMenuToggleState();
	});

	navMenu.addEventListener('click', (event) => {
		if (event.target.closest('a')) {
			navMenu.classList.remove('active');
			updateMenuToggleState();
		}
	});

	updateMenuToggleState();
}

if (themeToggle && themeIcon) {
	applyStoredTheme();
	themeToggle.addEventListener('click', () => {
		const isLightTheme = document.body.classList.toggle('light-theme');
		localStorage.setItem(themeStorageKey, isLightTheme ? 'light' : 'dark');
		updateThemeToggleState();
	});
} else {
	applyStoredTheme();
}
