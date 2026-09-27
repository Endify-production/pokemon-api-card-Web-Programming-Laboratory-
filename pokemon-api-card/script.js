const searchForm = document.getElementById("searchForm");
const pokemonInput = document.getElementById("pokemonInput");


const pokemonCard = document.getElementById("pokemonCard");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");


const pokemonName = document.getElementById("pokemonName");
const pokemonId = document.getElementById("pokemonId");
const pokemonImage = document.getElementById("pokemonImage");
const pokemonTypes = document.getElementById("pokemonTypes");


const pokemonHeight = document.getElementById("pokemonHeight");
const pokemonWeight = document.getElementById("pokemonWeight");


const abilities = document.getElementById("abilities");


const quickButtons = document.querySelectorAll(".quick-btn");




/* Search form */


searchForm.addEventListener("submit", function (event) {
    event.preventDefault();


    const name = pokemonInput.value.trim().toLowerCase();


    if (!name) {
        showError("Please enter a Pokémon name.");
        return;
    }


    searchPokemon(name);
});




/* Quick search buttons */


quickButtons.forEach(function (button) {


    button.addEventListener("click", function () {


        const pokemon = button.dataset.pokemon;


        pokemonInput.value = pokemon;


        searchPokemon(pokemon);
    });


});




/* Search Pokémon */


async function searchPokemon(name) {


    showLoading();


    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;


    try {


        const response = await fetch(url);


        if (!response.ok) {
            throw new Error("Pokémon not found.");
        }


        const data = await response.json();


        displayPokemon(data);


    } catch (error) {


        showError(
            "We couldn't find that Pokémon. Please check the name and try again."
        );


    } finally {


        hideLoading();


    }
}




/* Display Pokémon */


function displayPokemon(data) {


    hideError();


    pokemonCard.classList.remove("hidden");


    /* Name */


    pokemonName.textContent = capitalize(data.name);




    /* ID */


    pokemonId.textContent = `#${String(data.id).padStart(4, "0")}`;




    /* Image */


    const artwork =
        data.sprites.other["official-artwork"].front_default;


    pokemonImage.src = artwork;


    pokemonImage.alt = capitalize(data.name);




    /* Height */


    pokemonHeight.textContent =
        `${(data.height / 10).toFixed(1)} m`;




    /* Weight */


    pokemonWeight.textContent =
        `${(data.weight / 10).toFixed(1)} kg`;




    /* Types */


    displayTypes(data.types);




    /* Abilities */


    displayAbilities(data.abilities);




    /* Stats */


    displayStats(data.stats);
}




/* Display types */


function displayTypes(types) {


    pokemonTypes.innerHTML = "";


    types.forEach(function (item) {


        const typeName = item.type.name;


        const typeElement = document.createElement("span");


        typeElement.classList.add("type", typeName);


        typeElement.textContent = typeName.toUpperCase();


        pokemonTypes.appendChild(typeElement);
    });
}




/* Display abilities */


function displayAbilities(abilityData) {


    abilities.innerHTML = "";


    abilityData.forEach(function (item) {


        const abilityName = item.ability.name;


        const abilityElement = document.createElement("span");


        abilityElement.classList.add("ability");


        abilityElement.textContent =
            abilityName.replace("-", " ");


        abilities.appendChild(abilityElement);
    });
}




/* Display stats */


function displayStats(stats) {


    stats.forEach(function (item) {


        const statName = item.stat.name;
        const statValue = item.base_stat;


        if (statName === "hp") {


            updateStat("hp", statValue);


        } else if (statName === "attack") {


            updateStat("attack", statValue);


        } else if (statName === "defense") {


            updateStat("defense", statValue);


        } else if (statName === "special-attack") {


            updateStat("specialAttack", statValue);


        } else if (statName === "special-defense") {


            updateStat("specialDefense", statValue);


        } else if (statName === "speed") {


            updateStat("speed", statValue);


        }


    });
}




/* Update individual stat */


function updateStat(statName, value) {


    const valueElement =
        document.getElementById(`${statName}Value`);


    const barElement =
        document.getElementById(`${statName}Bar`);


    if (!valueElement || !barElement) {
        return;
    }


    valueElement.textContent = value;


    /*
        Pokémon base stats can go above 100.
        255 is the maximum base stat in the games,
        so we use 255 for the visual bar calculation.
    */


    const percentage = Math.min((value / 255) * 100, 100);


    barElement.style.width = `${percentage}%`;
}




/* Loading state */


function showLoading() {


    loading.classList.remove("hidden");


    pokemonCard.classList.add("hidden");


    errorMessage.classList.add("hidden");
}




function hideLoading() {


    loading.classList.add("hidden");
}




/* Error state */


function showError(message) {


    errorText.textContent = message;


    errorMessage.classList.remove("hidden");


    pokemonCard.classList.add("hidden");


    loading.classList.add("hidden");
}




function hideError() {


    errorMessage.classList.add("hidden");
}




/* Capitalize Pokémon name */


function capitalize(name) {


    return name.charAt(0).toUpperCase() + name.slice(1);
}
