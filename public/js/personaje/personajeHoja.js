import { getActiveCharacterId, getCharacterById } from '../db/db.js';

const sheetContainer = document.querySelector('#character-sheet');

// console.log(getCharacterById(getActiveCharacterId()));

const renderHojaPersonaje = (character) => {
	if (!sheetContainer) return;
	sheetContainer.innerHTML = `
		<h2>${character.name}</h2>
		<p><strong>Raza:</strong> ${character.race}</p>
		<p><strong>Clase:</strong> ${character.class} (Nivel ${character.classLevel})</p>
		<p><strong>Armadura:</strong> ${character.armor}</p>
		<p><strong>Puntos de vida:</strong> ${character.finalHp} (Base: ${character.baseHp})</p>
		<h3>Habilidades de clase</h3>
		<ul>
			${character.classAbilities
				.map((ability) => `<li>${ability}</li>`)
				.join('')}
		</ul>
		<h3>Atributos</h3>
		<ul>
			<li><strong>Fuerza:</strong> ${character.stats.strength}</li>
			<li><strong>Destreza:</strong> ${character.stats.dexterity}</li>
			<li><strong>Constitución:</strong> ${character.stats.constitution}</li>
			<li><strong>Inteligencia:</strong> ${character.stats.intelligence}</li>
			<li><strong>Sabiduría:</strong> ${character.stats.wisdom}</li>
			<li><strong>Carisma:</strong> ${character.stats.charisma}</li>
		</ul>
		<h3>Habilidades</h3>
		<ul>
			${character.skills
				.map((skill) => `<li>${skill}</li>`)
				.join('')}
		</ul>
		<h3>Hechizos</h3>
		<ul>
			${character.spells
				.map((spell) => `<li>${spell}</li>`)
				.join('')}
		</ul>
	`;
};

const activeCharacterId = getActiveCharacterId();
if (activeCharacterId) {
	const character = getCharacterById(activeCharacterId);
	if (character) {
		renderHojaPersonaje(character);
	} else {
		sheetContainer.innerHTML = '<p>No se encontro el personaje activo.</p>';
	}
} else {
	sheetContainer.innerHTML = '<p>No tenes pj todavia.</p>';
}
