import Pokemon from "./pokemon.js";
import Move from "./move.js";
import PokemonDBManager from "./pokemonDBManager.js";
import PokeAPI from "./pokeAPI.js";

export default class PokemonFacotry {
    /**
     * Check if poekmon and moves are in database. If not, fix it using external API
     *
     * @param {PokemonDBManager} pokemonDBManager - Instance of PokemonDBManager
     */
    static async #checkAndFix(pokemonDBManager, pokemonName) {
        // Wait for query to finish and check if pokemon's information is in the database
        if (!(await pokemonDBManager.containsPokemon(pokemonName))) {
            const pokemonApiInfo = await PokeAPI.getPokemonFromAPI(pokemonName); // Wait for API request

            if (pokemonApiInfo == null)
                throw new Error("Error with information from external API request");

            pokemonDBManager.insertPokemon(pokemonApiInfo["id"], pokemonApiInfo["name"], pokemonApiInfo["stats"][0]["base_stat"]);

            // Check if the moves from data is in the database
            // It will check the first 8 moves or if there is less, then all <- This is done to prevent spamming the external API
            const moves = pokemonApiInfo["moves"];

            for (let i = 0; i < 8 && i < moves.length; i++) {
                const moveName = moves[i]["move"]["name"];
                const moveApiInfo = await PokeAPI.getMoveFromApi(moveName); // Wait for API request

                if (moveApiInfo == null)
                    throw new Error("Error with information from external API request");

                // Wait for query to finish and check if move's information is in the database
                if (!(await pokemonDBManager.containsMove(moveName)))
                    pokemonDBManager.insertMove(moveApiInfo["id"], moveApiInfo["name"], moveApiInfo["power"], moveApiInfo["accuracy"]);

                // Connect pokemon with its moves whether move is in the database or not
                // Because if pokemon is not in the database, then means there is no connection to the between the pokemon and the move
                pokemonDBManager.insertHas(pokemonApiInfo["id"], moveApiInfo["id"]);
            }
        }
    }

    /**
     * Select moves for the pokemon (selects 4 moves if the total number of moves is greater than 4. Else, select all moves)
     *
     * @param {object[]} moves - Array of moves
     * @returns {object[]} Array of chosen moves
     */
    static selectMoves(moves) {
        if (moves.length <= 4)
            return moves;

        // Create a deep copy to prevent modification of the original data
        let movesCopy = structuredClone(moves);

        let chosenMoves = [];

        for (let i = 0; i < 4; i++) {
            const min = 0;
            const max = movesCopy.length - 1;
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

            chosenMoves.push(movesCopy[randomNum]);
            movesCopy.splice(randomNum, 1); // Remove at index
        }

        return chosenMoves;
    }

    /**
     * Create an instance of a pokemon
     *
     * @param {string} pokemonName - Name of the pokemon
     */
    static async create(pokemonName) {
        pokemonName = pokemonName.toLowerCase();

        const pokemonDBManager = PokemonDBManager.getInstance();
        let pokemon = null;

        try {
            pokemonDBManager.connect();

            // Wait for check if pokemon and move if pokemon is in database and fix what it needs
            await PokemonFacotry.#checkAndFix(pokemonDBManager, pokemonName);

            // Wait for retrieval of information from database
            const pokemonInfo = await pokemonDBManager.getPokemon(pokemonName);

            pokemon = new Pokemon(pokemonInfo["pokemon_id"], pokemonInfo["pokemon_name"], pokemonInfo["hp"]);

            // Wait for database to return all the moves of the pokemon and select the moves
            const moves = PokemonFacotry.selectMoves(await pokemonDBManager.getPokemonMoves(pokemonName));

            // Add moves to pokemon
            for (const move of moves)
                pokemon.addMove(new Move(move["move_id"], move["move_name"], move["power"], move["accuracy"]));
        }
        catch (err) {
            console.error("Error:", err);
        }
        finally {
            pokemonDBManager.disconnect();
        }

        return pokemon;
    }
}
