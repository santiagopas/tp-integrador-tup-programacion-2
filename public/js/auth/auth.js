//validación ingreso

const formIngreso = document.getElementById('formularioIngreso');
const alertError = document.getElementById('errorDatosIngreso');
const ingresar = document.getElementById('botonIngreso');

const renderError = (text) => {
	alertError.textContent = text;
	setTimeout(() => {
		alertError.textContent = null;
	}, 3000);
};

formIngreso.addEventListener('submit', (e) => {
	e.preventDefault();
	const usuariosStorage = JSON.parse(localStorage.getItem('usuarios')) || [];

	const correoLogin = document.getElementById('correoLogin').value;
	const contraLogin = document.getElementById('contraLogin').value;

	const usuarioEncontrado = usuariosStorage.find(
		(u) => u.correo === correoLogin && u.contra === contraLogin,
	);

	if (!usuarioEncontrado) {
		document.getElementById('contraLogin').value = '';
		return renderError(
			'El correo o la contraseña ingresados no son correctos, intente nuevamente',
		);
	}

	const usuariosActualizados = usuariosStorage.map((user) => ({
		...user,
		isLogged: user.id === usuarioEncontrado.id,
	}));

	localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
	const perfilUrl = new URL('./perfil.html', window.location.href);
	perfilUrl.searchParams.set('id', usuarioEncontrado.id);
	window.location.href = perfilUrl.toString();
});
