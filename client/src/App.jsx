import { useState } from "react";

import axios from "axios";

import "./App.css";

const URL = "http://localhost:8080";
const POKEMONS = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
    "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree",
    "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata",
    "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu",
    "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂",
    "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales",
    "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume",
    "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth",
    "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine",
    "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop",
    "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool",
    "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke",
    "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio", "Seel",
    "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar",
    "Onix", "Dunsparce", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee",
    "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey",
    "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu",
    "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electrode", "Voltorb", "Exeggutor",
    "Mewtwo", "Mew"
];

function App() {
    // Dynamic variables that changes over time
    const [chosenPokemon1, setChosenPokemon1] = useState(POKEMONS[0]);
    const [chosenPokemon2, setChosenPokemon2] = useState(POKEMONS[0]);

    const [pokemon1, setPokemon1] = useState(null);
    const [pokemon2, setPokemon2] = useState(null);

    const [pokemon1Hp, setPokemon1HP] = useState(0);
    const [pokemon2Hp, setPokemon2HP] = useState(0);

    const changePokemon = (event, player) => {
        if (player != 1 && player != 2) {
            console.error("Player can only be 1 or 2");
            return;
        }

        if (player == 1)
            setChosenPokemon1(event.target.value);
        else
            setChosenPokemon2(event.target.value);
    }

    const createPokemon = async (pokemonName, player) => {
        if (player != 1 && player != 2) {
            console.error("Player can only be 1 or 2");
            return;
        }

        try {
            // Wait for respond before proceeding
            const res = await axios.get(`${URL}/pokemon?player=${player}&name=${pokemonName}`);

            // No need to check status code. Axios already handles it

            if (player == 1) {
                setPokemon1(res.data);
                setPokemon1HP(res.data["pokemonHp"]);

                // Remove selector and button
                for (const element of document.getElementsByClassName("selectBtn1"))
                    element.style.display = "none";
            }
            else {
                setPokemon2(res.data);
                setPokemon2HP(res.data["pokemonHp"]);

                // Remove selector and button
                for (const element of document.getElementsByClassName("selectBtn2"))
                    element.style.display = "none";
            }
        }
        catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <>
            <select className="selectBtn1" onChange={(e) => { changePokemon(e, 1) }}>
                {POKEMONS.map((pokemonName) => {
                    return <option key={pokemonName}>{pokemonName}</option>
                })}
            </select>

            <br />

            <button className="selectBtn1" onClick={() => { createPokemon(chosenPokemon1, 1) }}>Confirm</button>

            {/* Does not render if pokemon1 is null */}
            {pokemon1 && <div className="pokemon" id="pokemon1">
                <h1>{pokemon1["pokemonName"]}</h1>

                <div>
                    HP
                    <div className="hpBorder">
                        <div className="hp" id="hp1" style={{ width: `${pokemon1Hp / pokemon1["pokemonHp"] * 100}%` }}></div>
                    </div>
                    <span>{`${pokemon1Hp}/${pokemon1["pokemonHp"]}`}</span>
                </div>
            </div>}

            <br />
            <hr />
            <br />

            <select className="selectBtn2" onChange={(e) => { changePokemon(e, 2) }}>
                {POKEMONS.map((pokemonName) => {
                    return <option key={pokemonName}>{pokemonName}</option>
                })}
            </select>

            <br />

            <button className="selectBtn2" onClick={() => { createPokemon(chosenPokemon2, 2) }}>Confirm</button>

            {/* Does not render if pokemon1 is null */}
            {pokemon2 && <div className="pokemon" id="pokemon2">
                <h1>{pokemon2["pokemonName"]}</h1>

                <div>
                    HP
                    <div className="hpBorder">
                        <div className="hp" id="hp2" style={{ width: `${pokemon2Hp / pokemon2["pokemonHp"] * 100}%` }}></div>
                    </div>
                    <span>{`${pokemon2Hp}/${pokemon2["pokemonHp"]}`}</span>
                </div>
            </div>}
        </>
    );
}

export default App
