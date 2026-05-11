import { saveCharacter, setActiveCharacterId } from '../db/db.js';
import { classAbilities } from './habilidades.js';

const characterForm = document.querySelector('.character-form');

if (characterForm) {
	const characterNameInput = document.querySelector('#character-name');
	const raceSelect = document.querySelector('#race');
	const classSelect = document.querySelector('#class');
	const levelSelect = document.querySelector('#class-level');
	const abilitiesField = document.querySelector('#class-abilities');
	const finalHpOutput = document.querySelector('#final-hp');
	const constitutionInput = document.querySelector('#constitution');
	const skillsHint = document.querySelector('#skills-hint');
	const skillsInputs = Array.from(
		document.querySelectorAll('input[name="skills"]'),
	);
	const spellsSelect = document.querySelector('#spells');
	const strengthInput = document.querySelector('#strength');
	const dexterityInput = document.querySelector('#dexterity');
	const intelligenceInput = document.querySelector('#intelligence');
	const wisdomInput = document.querySelector('#wisdom');
	const charismaInput = document.querySelector('#charisma');

	const casterClasses = new Set(['hechicero', 'clerigo', 'paladin']);

	const toNumber = (value) => {
		const numeric = Number(value);
		return Number.isFinite(numeric) ? numeric : 0;
	};

	const getSelectedClassOption = () => {
		if (!classSelect || classSelect.selectedIndex < 0) {
			return null;
		}

		return classSelect.options[classSelect.selectedIndex];
	};

	const updateClassAbilities = () => {
		if (!abilitiesField) {
			return;
		}

		const classValue = classSelect ? classSelect.value : '';
		const level = toNumber(levelSelect ? levelSelect.value : 0);
		const abilities = classAbilities[classValue] || [];
		const activeAbilities = abilities
			.filter((ability) => level >= ability.level)
			.map((ability) => `Nivel ${ability.level}: ${ability.name}`);

		abilitiesField.value = activeAbilities.join('\n');
	};

	const updateFinalHp = () => {
		if (!finalHpOutput) {
			return;
		}

		const selectedOption = getSelectedClassOption();
		const baseHp = toNumber(selectedOption ? selectedOption.dataset.baseHp : 0);
		const level = toNumber(levelSelect ? levelSelect.value : 0);
		const constitutionScore =
			toNumber(constitutionInput ? constitutionInput.value : 0) || 10;
		const constitutionModifier = Math.floor((constitutionScore - 10) / 2);

		if (!baseHp || !level) {
			finalHpOutput.textContent = '0';
			return;
		}

		const totalHp = (baseHp + constitutionModifier) * level;
		finalHpOutput.textContent = String(Math.max(1, totalHp));
	};

	const updateSpellsState = () => {
		if (!spellsSelect) {
			return;
		}

		const classValue = classSelect ? classSelect.value : '';
		const canCast = casterClasses.has(classValue);

		spellsSelect.disabled = !canCast;

		if (!canCast) {
			Array.from(spellsSelect.options).forEach((option) => {
				option.selected = false;
			});
		}
	};

	const updateSkillsState = (changedInput) => {
		const checkedInputs = skillsInputs.filter((input) => input.checked);

		if (checkedInputs.length > 4 && changedInput) {
			changedInput.checked = false;
		}

		const totalChecked = skillsInputs.filter((input) => input.checked).length;
		const remaining = 4 - totalChecked;
		const lockRemaining = totalChecked >= 4;

		skillsInputs.forEach((input) => {
			if (!input.checked) {
				input.disabled = lockRemaining;
			}
		});

		if (skillsInputs[0]) {
			skillsInputs[0].setCustomValidity(
				totalChecked === 4 ? '' : 'Selecciona exactamente 4 habilidades.',
			);
		}

		if (skillsHint) {
			skillsHint.setAttribute('aria-live', 'polite');

			if (totalChecked === 0) {
				skillsHint.textContent = 'Elegi 4 habilidades.';
			} else if (totalChecked === 4) {
				skillsHint.textContent = 'Seleccionaste 4 habilidades.';
			} else {
				skillsHint.textContent = `Te faltan ${remaining} habilidad${
					remaining === 1 ? '' : 'es'
				}.`;
			}
		}
	};

	const updateDerivedFields = () => {
		updateClassAbilities();
		updateFinalHp();
		updateSpellsState();
	};

	if (classSelect) {
		classSelect.addEventListener('change', updateDerivedFields);
	}

	if (levelSelect) {
		levelSelect.addEventListener('change', updateDerivedFields);
	}

	if (constitutionInput) {
		constitutionInput.addEventListener('input', updateFinalHp);
	}

	skillsInputs.forEach((input) => {
		input.addEventListener('change', (event) => {
			updateSkillsState(event.target);
		});
	});

	updateSkillsState();
	updateDerivedFields();

	const clearForm = () => {
		setTimeout(() => {
			if (abilitiesField) {
				abilitiesField.value = '';
			}

			if (finalHpOutput) {
				finalHpOutput.textContent = '0';
			}

			updateSkillsState();
			updateSpellsState();
		}, 0);
	};

	characterForm.addEventListener('submit', (event) => {
		updateSkillsState();

		if (!characterForm.checkValidity()) {
			characterForm.reportValidity();
			event.preventDefault();
			return;
		}

		event.preventDefault();

		const selectedOption = getSelectedClassOption();
		const baseHp = toNumber(selectedOption ? selectedOption.dataset.baseHp : 0);
		const armor = selectedOption ? selectedOption.dataset.armor : '';
		const classLevel = toNumber(levelSelect ? levelSelect.value : 0);
		const finalHp = toNumber(finalHpOutput ? finalHpOutput.textContent : 0);
		const classAbilitiesValue = abilitiesField ? abilitiesField.value : '';
		const classAbilitiesList = classAbilitiesValue
			? classAbilitiesValue.split('\n').filter(Boolean)
			: [];
		const selectedSkills = skillsInputs
			.filter((input) => input.checked)
			.map((input) => input.value);
		const selectedSpells = spellsSelect
			? Array.from(spellsSelect.selectedOptions).map((option) => option.value)
			: [];

		const characterId =
			window.crypto && 'randomUUID' in window.crypto
				? window.crypto.randomUUID()
				: String(Date.now());

		const createdDate = () => {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');

			return `${day}-${month}-${year}`;
		};

		const newCharacter = {
			id: characterId,
			name: characterNameInput ? characterNameInput.value.trim() : '',
			race: raceSelect ? raceSelect.value : '',
			class: classSelect ? classSelect.value : '',
			classLevel,
			armor,
			baseHp,
			finalHp,
			currentHp: finalHp,
			classAbilities: classAbilitiesList,
			stats: {
				strength: toNumber(strengthInput ? strengthInput.value : 0),
				dexterity: toNumber(dexterityInput ? dexterityInput.value : 0),
				constitution: toNumber(constitutionInput ? constitutionInput.value : 0),
				intelligence: toNumber(intelligenceInput ? intelligenceInput.value : 0),
				wisdom: toNumber(wisdomInput ? wisdomInput.value : 0),
				charisma: toNumber(charismaInput ? charismaInput.value : 0),
			},
			skills: selectedSkills,
			spells: selectedSpells,
			createdAt: createdDate(),
		};

		saveCharacter(newCharacter);
		setActiveCharacterId(characterId);

		clearForm();
		const redirectUrl = new URL('./personaje-hoja.html', window.location.href);
		redirectUrl.searchParams.set('id', characterId);
		window.location.href = redirectUrl;
	});

	characterForm.addEventListener('reset', () => {
		clearForm();
	});
}
