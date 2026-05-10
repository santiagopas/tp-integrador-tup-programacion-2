const menuToggle = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const themeToggle = document.querySelector('#theme-toggle');
const themeIcon = document.querySelector('#theme-toggle img');
const menuIcon = menuToggle?.querySelector('img');
const themeStorageKey = 'theme';

const updateMenuToggleState = () => {
	if (!menuToggle || !navMenu || !menuIcon) {
		return;
	}

	const isMenuOpen = navMenu.classList.contains('active');
	menuIcon.src = isMenuOpen
		? './assets/icons/d10-white.svg'
		: './assets/icons/d20-white.svg';
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
