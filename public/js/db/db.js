const STORAGE_KEY = 'personajes';
const ACTIVE_KEY = 'idPersonajeActivo';

export const getCharacters = () => {
	const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
	return Array.isArray(stored) ? stored : [];
};

export const getUsers = () => {
	const storedUsers = JSON.parse(localStorage.getItem('usuarios'));
	return Array.isArray(storedUsers) ? storedUsers : [];
};

export const getUser = () => {
	const users = getUsers();
	return users.find(u => u.isLogged) || null;
};

export const saveUser = (updatedUser) => {
	const users = getUsers();
	const index = users.findIndex(u => u.id === updatedUser.id);
	if (index !== -1) {
		users[index] = updatedUser;
	} else {
		users.push(updatedUser);
	}
	localStorage.setItem('usuarios', JSON.stringify(users));
};

export const saveCharacters = (characters) => {
	const safeCharacters = Array.isArray(characters) ? characters : [];
	localStorage.setItem(STORAGE_KEY, JSON.stringify(safeCharacters));
	return safeCharacters;
};

export const saveCharacter = (character) => {
	const characters = getCharacters();
	characters.push(character);
	saveCharacters(characters);
	return character;
};

export const getCharacterById = (id) => {
	if (!id) {
		return null;
	}

	const characters = getCharacters();
	return characters.find((character) => character.id === id) || null;
};

export const setActiveCharacterId = (id) => {
	if (!id) {
		return;
	}

	localStorage.setItem(ACTIVE_KEY, id);
};

export const getActiveCharacterId = () => localStorage.getItem(ACTIVE_KEY);
