const STORAGE_KEY = 'personajes';
const ACTIVE_KEY = 'idPersonajeActivo';

export const getCharacters = () => {
	const stored =  JSON.parse(localStorage.getItem(STORAGE_KEY));
	return Array.isArray(stored) ? stored : [];
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