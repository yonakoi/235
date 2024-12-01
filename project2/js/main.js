// 1
window.onload = () => {
    document.querySelector("#search").onclick = searchButtonClicked;
};

// 2
let displayTerm = "";

async function searchButtonClicked() {
    console.log("searchButtonClicked() called");

    let term = document.querySelector("#searchterm").value.trim().toLowerCase();
    let limit = parseInt(document.querySelector("#limit").value, 10);
    let regionValue = parseInt(document.querySelector("#region").value, 10);
    let region = regionValue === 0 ? null : regionValue; // If "Any" is selected, region is null

    displayTerm = term;

    if (term.length < 1) return;

    document.querySelector("#status").innerHTML = `<b>Searching for Pokémon...</b>`;

    console.log(
        `Searching for type: ${term}, region: ${region || "Any"}, with limit: ${limit}`
    );

    //types out error in search results if user doesn't input a correct type
    try {
        let allPokemons = await fetchPokemonsByTypeAndRegion(term, region);
        let limitedPokemons = allPokemons.slice(0, limit); // Apply limit here
        displayPokemons(limitedPokemons, region);
    } catch (error) {
        document.querySelector("#status").innerHTML = `<b>Error: ${error.message}</b>`;
        console.error(error);
    }
}


async function fetchPokemonsByTypeAndRegion(type, region) {
    const TYPE_API_URL = `https://pokeapi.co/api/v2/type/${type}/`;

    // Fetch Pokémon by type
    let typeResponse = await fetch(TYPE_API_URL);
    if (!typeResponse.ok) {
        throw new Error(`Failed to fetch type data: ${typeResponse.status}`);
    }

    let typeData = await typeResponse.json();
    let typePokemons = typeData.pokemon.map((p) => p.pokemon.name);

    let filteredPokemonNames = typePokemons;

    if (region) {
        // If region is specified, filter Pokémon by region
        const REGION_API_URL = `https://pokeapi.co/api/v2/generation/${region}/`;
        let regionResponse = await fetch(REGION_API_URL);
        if (!regionResponse.ok) {
            throw new Error(`Failed to fetch region data: ${regionResponse.status}`);
        }

        let regionData = await regionResponse.json();
        let regionPokemons = regionData.pokemon_species.map((p) => p.name);

        // Combine the filters: Pokémon must belong to the selected type and region
        filteredPokemonNames = typePokemons.filter((name) =>
            regionPokemons.includes(name)
        );
    }

    //if not a type, throw error
    if (filteredPokemonNames.length === 0) {
        throw new Error(
            `No Pokémon found for type '${type}' in region '${region || "Any"}'`
        );
    }

    // Fetch detailed data for the filtered Pokémon
    let promises = filteredPokemonNames.map(async (name) => {
        let pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) =>
            res.json()
        );

        // Fetch generation data to determine region
        let speciesData = await fetch(pokemonData.species.url).then((res) =>
            res.json()
        );
        let generationUrl = speciesData.generation.url;
        let generationData = await fetch(generationUrl).then((res) => res.json());
        let regionName = generationData.main_region.name;

        return { ...pokemonData, region: regionName }; // Add region data to Pokémon
    });

    let allPokemons = await Promise.all(promises);

    return allPokemons;
}


function displayPokemons(pokemons) {
    let bigString = "";

    //displays pokemon - name first, image, and then information.
    pokemons.forEach((pokemon) => {
        let name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        let sprite = pokemon.sprites.front_default;
        let region = pokemon.region.charAt(0).toUpperCase() + pokemon.region.slice(1);

        bigString += `
            <div class='result'>
                <h3>${name}</h3>
                <img src='${sprite}' alt='${name}' />
                <p>Type(s): ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
                <p>Region: ${region}</p>
            </div>
        `;
    });

    //display term after loading in
    document.querySelector("#content").innerHTML = bigString;
    document.querySelector("#status").innerHTML = `<p><i>Displaying ${pokemons.length} Pokémon of type '${displayTerm}'</i></p>`;

    // Fade in images after they load
    const images = document.querySelectorAll("div.result img");
    images.forEach((img) => {
        img.onload = () => {
            img.style.opacity = 1; // Trigger fade-in
        };
    });
}

