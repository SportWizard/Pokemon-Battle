import express from "express";
import cors from "cors";

import PokemonFacotry from "./pokemonFactory.js";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8080;

let pokemon1 = null;
let pokemon2 = null;

app.get("/pokemon", async (req, res) => {
    const player = req.query.player; // Getting player number (1 or 2)
    const pokemonName = req.query.name; // Getting the name of the pokemon

    if (!player) {
        res.status(400).json({ error: "Missing \"player\" query parameter" });
        return;
    }

    if (player != 1 && player != 2) {
        res.status(400).json({ error: "Player query can only be 1 or 2" });
        return;
    }

    if (!pokemonName) {
        res.status(400).json({ error: "Missing \"name\" query parameter" });
        return;
    }

    try {
        // Wait for pokemon to be created
        const pokemon = await PokemonFacotry.create(pokemonName);

        // Assign to specific player
        if (player == 1)
            pokemon1 = pokemon;
        else
            pokemon2 = pokemon;

        res.status(200).json({
            "pokemonName": pokemon.name,
            "pokemonHp": pokemon.hp,
            "pokemonMoves": Object.keys(pokemon.moves)
        });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/attack", (req, res) => {
    // Retrieve informations
    const player = req.query.player;
    const moveName = req.query.name;

    if (!player) {
        res.status(400).json({ error: "Missing \"player\" query paramter" });
        reutrn;
    }

    if (player != 1 && player != 2) {
        res.status(400).json({ error: "Player query can only be 1 or 2" });
        return;
    }

    if (!moveName) {
        res.status(400).json({ error: "Missing \"name\" query parameter" });
        return;
    }

    if (pokemon1 == null || pokemon2 == null)
        res.status(400).json({ error: "Pokemon1 or pokemon2 has not been initialized" });

    let power;
    let accuracy;

    // Deteremine whether it is a hit or not
    const dmgDetermintor = (accuracy) => {
        return (Math.random() < accuracy / 100) ? 1 : 0;
    }

    if (player == 1) {
        if (!(moveName in pokemon1.moves)) {
            res.status(400).json({ error: "Pokemon1 does not have move:", moveName })
            return;
        }

        power = pokemon1.moves[moveName].power;
        accuracy = pokemon1.moves[moveName].accuracy;

        const dmg = power * dmgDetermintor(accuracy);

        res.status(200).json({ damange: dmg });
    }
    else {
        if (!(moveName in pokemon2.moves)) {
            res.status(400).json({ error: "Pokemon2 does not have move:", moveName })
            return;
        }

        power = pokemon2.moves[moveName].power;
        accuracy = pokemon2.moves[moveName].accuracy;

        const dmg = power * dmgDetermintor(accuracy);

        res.status(200).json({ damange: dmg });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})
