/* ==================== Elements ==================== */

const searchForm = document.getElementById("searchForm");
const pokemonInput = document.getElementById("pokemonInput");
const searchMode = document.getElementById("searchMode");

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

const favBtn = document.getElementById("favBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const detailsBtn = document.getElementById("detailsBtn");
const randomBtn = document.getElementById("randomBtn");

let currentId = 1;


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
            "We couldn't find that Pokémon. Please check the name or number.";
        errorMessage.classList.remove("hidden");

    } finally {
        loading.classList.add("hidden");
    }
}


function showPokemon(data) {
    currentId = data.id;

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

    favBtn.classList.remove("active");
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
        errorText.textContent = "Please enter a Pokémon name or number.";
        errorMessage.classList.remove("hidden");
        pokemonCard.classList.add("hidden");
        loading.classList.add("hidden");
        return;
    }

    const query = searchMode.value === "name" ? value.toLowerCase() : value;
    loadPokemon(query);
});


prevBtn.addEventListener("click", function () {
    if (currentId > 1) loadPokemon(currentId - 1);
});


nextBtn.addEventListener("click", function () {
    if (currentId < 1025) loadPokemon(currentId + 1);
});


randomBtn.addEventListener("click", function () {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    pokemonInput.value = randomId;
    loadPokemon(randomId);
});


detailsBtn.addEventListener("click", function () {
    const url = "https://pokemondb.net/pokemon/" + nameEl.textContent.toLowerCase();
    window.open(url, "_blank");
});


favBtn.addEventListener("click", function () {
    favBtn.classList.toggle("active");
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
