import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";

import "./App.css";

const URL = "http://localhost:8080";
const POKEMONS = [
    "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
    "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree",
    "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata",
    "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu",
    "Sandshrew", "Sandslash", "Nidorina", "Nidoqueen", "Nidorino", "Nidoking",
    "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff",
    "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume",
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
    "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electrode", "Voltorb", "Mewtwo", "Mew"
];

function App() {
    // Dynamic variables that changes over time
    const [chosenPokemon1, setChosenPokemon1] = useState(POKEMONS[0]);
    const [chosenPokemon2, setChosenPokemon2] = useState(POKEMONS[0]);

    const [pokemon1, setPokemon1] = useState(null);
    const [pokemon2, setPokemon2] = useState(null);

    const [pokemon1Hp, setPokemon1HP] = useState(0);
    const [pokemon2Hp, setPokemon2HP] = useState(0);

    const [turn, setTurn] = useState(1);

    const [gameOver, setGameOver] = useState(false);

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
            // Wait for reponse before proceeding
            const res = await axios.get(`${URL}/pokemon?player=${player}&name=${pokemonName}`);

            // No need to check status code. Axios already handles it

            const resData = res.data;

            if (player == 1) {
                setPokemon1(resData);
                setPokemon1HP(resData["pokemonHp"]);
            }
            else {
                setPokemon2(resData);
                setPokemon2HP(resData["pokemonHp"]);
            }
        }
        catch (err) {
            console.error("Error:", err);
        }
    };

    const attack = async (moveName) => {
        try {
            // Wait for resopnse before proceeding
            const res = await axios.get(`${URL}/attack?player=${turn}&name=${moveName}`);

            // No need to check status code. Axios already handles it

            const dmg = res.data["damange"];

            if (turn == 1) {
                if (pokemon2Hp - dmg > 0)
                    setPokemon2HP(pokemon2Hp - dmg);
                else {
                    setPokemon2HP(0);
                    setGameOver(true);
                }
            }
            else {
                if (pokemon1Hp - dmg > 0)
                    setPokemon1HP(pokemon1Hp - dmg);
                else {
                    setPokemon1HP(0);
                    setGameOver(true);
                }
            }

            setTurn((turn % 2) + 1);
        }
        catch (err) {
            console.error("Error:", err);
        }
    }

    const restart = () => {
        setChosenPokemon1(POKEMONS[0]);
        setChosenPokemon2(POKEMONS[0]);


        setPokemon1(null);
        setPokemon2(null);

        setPokemon1HP(0);
        setPokemon2HP(0);

        setTurn(1);

        setGameOver(false);
    }

    return (
        <>
            {/* Display all 151 pokemon as an option */}
            {pokemon1 == null && pokemon2 == null &&
                <div>
                    <select className="selectBtn1" value={chosenPokemon1} onChange={(e) => { changePokemon(e, 1) }}>
                        {POKEMONS.map((pokemonName) => {
                            return <option key={uuidv4()}>{pokemonName}</option>
                        })}
                    </select>

                    <br />

                    <button className="selectBtn1" onClick={() => { createPokemon(chosenPokemon1, 1) }}>Confirm</button>
                </div>
            }

            {/* Does not render if pokemon1 is null */}
            {pokemon1 &&
                <div className="pokemon" id="pokemon1">
                    <h1>{pokemon1["pokemonName"]}</h1>

                    <div>
                        HP
                        <div className="hpBorder">
                            <div className="hp" id="hp1" style={{ width: `${pokemon1Hp / pokemon1["pokemonHp"] * 100}%` }}></div>
                        </div>
                        <span>{`${pokemon1Hp}/${pokemon1["pokemonHp"]}`}</span>
                    </div>
                </div>
            }

            <br />
            <hr />
            <br />

            {/* Display all 151 pokemon as an option */}
            <select className="selectBtn2" value={chosenPokemon2} onChange={(e) => { changePokemon(e, 2) }}>
                {POKEMONS.map((pokemonName) => {
                    return <option key={uuidv4()}>{pokemonName}</option>
                })}
            </select>

            <br />

            <button className="selectBtn2" onClick={() => { createPokemon(chosenPokemon2, 2) }}>Confirm</button>

            {/* Does not render if pokemon2 is null */}
            {pokemon2 &&
                <div className="pokemon" id="pokemon2">
                    <h1>{pokemon2["pokemonName"]}</h1>

                    <div>
                        HP
                        <div className="hpBorder">
                            <div className="hp" id="hp2" style={{ width: `${pokemon2Hp / pokemon2["pokemonHp"] * 100}%` }}></div>
                        </div>
                        <span>{`${pokemon2Hp}/${pokemon2["pokemonHp"]}`}</span>
                    </div>
                </div>
            }

            {pokemon1 && pokemon2 && !gameOver &&
                <div id="menu">
                    <h2>Turn: {turn == 1 ? `Player 1 (${pokemon1["pokemonName"]})` : `Player 2 (${pokemon2["pokemonName"]})`}</h2>
                    {/* Move of the poekemon is dipslayed depending on the turn */}
                    {turn == 1 &&
                        pokemon1["pokemonMoves"].map((move) => {
                            return <button key={uuidv4()} className="moveBtn" onClick={() => { attack(move) }}>{move}</button>
                        })
                    }

                    {turn == 2 &&
                        pokemon2["pokemonMoves"].map((move) => {
                            return <button key={uuidv4()} className="moveBtn" onClick={() => { attack(move) }}>{move}</button>
                        })
                    }
                </div>
            }

            {gameOver &&
                <div id="gameOver">
                    <h1>Game Over</h1>
                    <button onClick={() => { restart() }}>Restart</button>
                </div>
            }
        </>
    );
}

export default App
