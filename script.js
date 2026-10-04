/* ==================== Elements ==================== */

const searchForm = document.getElementById("searchForm");
const pokemonInput = document.getElementById("pokemonInput");

const pokemonCard = document.getElementById("pokemonCard");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const nameEl = document.getElementById("pokemonName");
const idEl = document.getElementById("pokemonId");
const imageEl = document.getElementById("pokemonImage");
const typesEl = document.getElementById("pokemonTypes");
const heightEl = document.getElementById("pokemonHeight");
const weightEl = document.getElementById("pokemonWeight");
const typeQuickEl = document.getElementById("pokemonTypeQuick");
const abilitiesEl = document.getElementById("abilities");

const allBtn = document.getElementById("allBtn");
const allSection = document.getElementById("allSection");
const allGrid = document.getElementById("allGrid");

let allLoaded = false;


/* ==================== Body colors ==================== */

const COLORS = {
    black: "#4a5060",
    blue: "#4a90e2",
    brown: "#a9714b",
    gray: "#8b93a5",
    green: "#4faf6b",
    pink: "#ef6d97",
    purple: "#9b6ae0",
    red: "#ef5f5f",
    white: "#96a0b6",
    yellow: "#e8a91b"
};


/* Change the page color to the Pokémon's body color */
async function changeColor(pokemonId) {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
        const response = await fetch(url);
        if (!response.ok) return;

        const species = await response.json();
        const color = COLORS[species.color.name] || COLORS.red;

        document.documentElement.style.setProperty("--main", color);
    } catch (error) {
        /* keep the current color */
    }
}


/* ==================== Load a Pokémon ==================== */

async function loadPokemon(query) {
    loading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    pokemonCard.classList.add("hidden");

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${query}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Not found");
        }

        const data = await response.json();

        changeColor(data.id);
        showPokemon(data);

    } catch (error) {
        errorText.textContent =
            "We couldn't find that Pokémon. Please check the name and try again.";
        errorMessage.classList.remove("hidden");

    } finally {
        loading.classList.add("hidden");
    }
}


function showPokemon(data) {
    pokemonCard.classList.remove("hidden");

    nameEl.textContent = capitalize(data.name);
    idEl.textContent = "#" + String(data.id).padStart(4, "0");

    imageEl.src = data.sprites.other["official-artwork"].front_default;
    imageEl.alt = capitalize(data.name);

    heightEl.textContent = (data.height / 10).toFixed(1) + " m";
    weightEl.textContent = (data.weight / 10).toFixed(1) + " kg";

    showTypes(data.types);
    showAbilities(data.abilities);
    showStats(data.stats);
}


/* ==================== Parts of the card ==================== */

const STAR =
    '<svg viewBox="0 0 24 24"><path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 16.4 6.8 19.3l1-5.9L3.5 9.2l5.9-.8L12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';


function showTypes(types) {
    let html = "";

    types.forEach(function (item) {
        const name = item.type.name;
        html += `<span class="type-badge type-${name}">${STAR}${name.toUpperCase()}</span>`;
    });

    typesEl.innerHTML = html;

    const first = types[0].type.name;
    typeQuickEl.className = `type-badge small type-${first}`;
    typeQuickEl.textContent = capitalize(first);
}


function showAbilities(abilities) {
    let html = "";

    abilities.forEach(function (item) {
        html += `<span class="chip">${titleCase(item.ability.name)}</span>`;
    });

    abilitiesEl.innerHTML = html;
}


function showStats(stats) {
    stats.forEach(function (item) {
        const row = document.querySelector(`[data-stat="${item.stat.name}"]`);
        if (!row) return;

        row.querySelector(".stat-value").textContent = item.base_stat;
        row.querySelector(".stat-fill").style.width =
            Math.min(item.base_stat, 100) + "%";
    });
}


/* ==================== Buttons ==================== */

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = pokemonInput.value.trim();

    if (!value) {
        errorText.textContent = "Please enter a Pokémon name.";
        errorMessage.classList.remove("hidden");
        pokemonCard.classList.add("hidden");
        loading.classList.add("hidden");
        return;
    }

    loadPokemon(value.toLowerCase());
});


/* Show a grid with every Pokémon card */
allBtn.addEventListener("click", function () {
    allSection.classList.toggle("hidden");

    if (allLoaded) return;

    loadAllPokemon();
});


async function loadAllPokemon() {
    allGrid.innerHTML = "<p>Loading...</p>";

    try {
        const url = "https://pokeapi.co/api/v2/pokemon?limit=1025";
        const response = await fetch(url);
        const data = await response.json();

        let html = "";

        data.results.forEach(function (item) {
            const id = Number(item.url.split("/").filter(Boolean).pop());
            const number = String(id).padStart(4, "0");

            html += `
                <button class="poke-mini" data-id="${id}">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png"
                         alt="${item.name}" loading="lazy">
                    <span>${titleCase(item.name)}</span>
                    <small>#${number}</small>
                </button>`;
        });

        allGrid.innerHTML = html;
        allLoaded = true;

    } catch (error) {
        allGrid.innerHTML = "<p>Could not load the Pokémon list.</p>";
    }
}


/* Click a card in the grid to open it */
allGrid.addEventListener("click", function (event) {
    const card = event.target.closest(".poke-mini");
    if (!card) return;

    loadPokemon(card.dataset.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ==================== Helpers ==================== */

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}


function titleCase(text) {
    return text
        .split("-")
        .map(function (part) {
            return capitalize(part);
        })
        .join(" ");
}


/* ==================== Start ==================== */

loadPokemon("clefairy");
