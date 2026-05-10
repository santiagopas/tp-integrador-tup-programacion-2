import {
	getActiveCharacterId,
	getCharacterById,
	getCharacters,
	saveCharacters,
} from '../db/db.js';

const sheetContainer = document.querySelector('#character-sheet');

console.log(getCharacterById(getActiveCharacterId()));

const renderHojaPersonaje = (character) => {
	if (!sheetContainer) return;

	sheetContainer.innerHTML = `
		<article class="dnd-sheet">
			<header class="dnd-header">
				<figure class="dnd-avatar-container">
					<div class="dnd-avatar" role="img" aria-label="Avatar de ${character.name}"></div>
				</figure>
				<section class="dnd-char-info">
					<h1 class="dnd-char-name">${character.name}</h1>
					<p class="dnd-char-meta">
						<span class="dnd-meta-item">${character.race}</span>
						<span class="dnd-meta-divider">•</span>
						<span class="dnd-meta-item">${character.class} (Nivel ${character.classLevel})</span>
					</p>
				</section>
			</header>

			<div class="dnd-body">
				<aside class="dnd-sidebar">
					<dl class="dnd-stats-container">
						${[
							{ name: 'Fuerza', val: character.stats.strength },
							{ name: 'Destreza', val: character.stats.dexterity },
							{ name: 'Constitución', val: character.stats.constitution },
							{ name: 'Inteligencia', val: character.stats.intelligence },
							{ name: 'Sabiduría', val: character.stats.wisdom },
							{ name: 'Carisma', val: character.stats.charisma },
						]
							.map(
								(stat) => `
							<div class="dnd-stat-box">
								<dt class="dnd-stat-name">${stat.name}</dt>
								<dd class="dnd-stat-mod">${stat.val}</dd>
							</div>
						`,
							)
							.join('')}
					</dl>

					<section class="dnd-section dnd-skills-section">
						<header class="dnd-section-header">
							<h3>Habilidades</h3>
						</header>
						<ul class="dnd-list">
							${
								character.skills && character.skills.length > 0
									? character.skills
											.map(
												(skill) =>
													`<li><span class="dnd-list-icon"></span> ${skill}</li>`,
											)
											.join('')
									: '<li>Sin habilidades</li>'
							}
						</ul>
					</section>
				</aside>

				<main class="dnd-main-content">
					<section class="dnd-combat-header" aria-label="Estadísticas de combate">
						<article class="dnd-combat-box">
							<strong class="dnd-combat-val">${character.armor}</strong>
							<h3 class="dnd-combat-label">Armadura</h3>
						</article>
						<article class="dnd-combat-box dnd-hp-box">
							<header class="dnd-hp-top">
								<h3 class="dnd-combat-label">Puntos de vida</h3>
							</header>
							<div class="dnd-hp-mid">
								<p class="dnd-hp-current">
									<label class="dnd-current-hp" aria-label="Puntos de vida actuales">
										<input type="number" min="0" max="${character.finalHp}" value=${character.currentHp}>
									</label>
									<span class="dnd-hp-max"> / ${character.finalHp}</span>
								</p>
							</div>
						</article>
					</section>

					<div class="dnd-main-sections">
						<section class="dnd-section">
							<header class="dnd-section-header">
								<h3>Habilidades de clase</h3>
							</header>
							<ul class="dnd-features-list">
								${
									character.classAbilities &&
									character.classAbilities.length > 0
										? character.classAbilities
												.map(
													(ability) => `
									<li class="dnd-feature-item">
										<strong class="dnd-feature-name">${ability}</strong>
									</li>
								`,
												)
												.join('')
										: '<li class="dnd-feature-item"><strong class="dnd-feature-name">Ninguna</strong></li>'
								}
							</ul>
						</section>

						<section class="dnd-section">
							<header class="dnd-section-header">
								<h3>Hechizos</h3>
							</header>
							<ul class="dnd-features-list">
								${
									character.spells && character.spells.length > 0
										? character.spells
												.map(
													(spell) => `
									<li class="dnd-feature-item">
										<strong class="dnd-feature-name">${spell}</strong>
									</li>
								`,
												)
												.join('')
										: '<li class="dnd-feature-item"><strong class="dnd-feature-name">Ninguno</strong></li>'
								}
							</ul>
						</section>
					</div>
				</main>
			</div>
		</article>
	`;

	const hpInput = sheetContainer.querySelector('.dnd-current-hp input');
	if (hpInput) {
		hpInput.addEventListener('change', (e) => {
			let newHp = parseInt(e.target.value, 10);
			if (isNaN(newHp) || newHp < 0) newHp = 0;
			if (newHp > character.finalHp) newHp = character.finalHp;

			character.currentHp = newHp;
			e.target.value = newHp;

			const characters = getCharacters();
			const index = characters.findIndex((c) => c.id === character.id);
			if (index !== -1) {
				characters[index].currentHp = newHp;
				saveCharacters(characters);
			}
		});
	}
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
