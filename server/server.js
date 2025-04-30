import express from "express";
import cors from "cors";

import PokemonFacotry from "./pokemonFactory.js";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8080;

let player1 = null;
let player2 = null;

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
            player1 = pokemon;
        else
            player2 = pokemon;

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

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})
