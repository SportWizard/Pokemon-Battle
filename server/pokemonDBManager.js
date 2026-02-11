import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

/**
 * Database manager
 */
export default class PokemonDBManager {
    static #instance = null;

    #connection = null;

    /**
     * Single instance (singleton)
     *
     * @returns {PokemonDBManager} Instance of PokemonDBManager
     */
    static getInstance() {
        if (PokemonDBManager.#instance === null)
            PokemonDBManager.#instance = new PokemonDBManager()

        return PokemonDBManager.#instance;
    }

    /**
     * Connect to database
     */
    connect() {
        this.#connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: "pokemon_data",
            port: process.env.PORT
        });

        console.log("Connected to database");
    }

    /**
     * Disconnect from database
     */
    disconnect() {
        this.#connection.end((err) => {
            if (err)
                throw err;

            console.log("Disconnected from database");
        });
    }

    /**
     * Check if pokemon is in database
     *
     * @param {string} pokemonName - Name of the pokemon
     * @returns {boolean} If the pokemon is in the database
     */
    async containsPokemon(pokemonName) {
        console.log("Checking if pokemon is in database");

        const query = "SELECT * FROM pokemon WHERE pokemon_name = ?";

        // Wait until this process is finished (without async and promise the function will finish before query) <- promise used for retrieving results
        const [results] = await this.#connection.promise().execute(query, [pokemonName]);

        return results.length > 0;
    }

    /**
     * Check if move is in database
     *
     * @param {string} moveName - Name of the move
     * @returns {boolean} If the move is in the database
     */
    async containsMove(moveName) {
        console.log("Checking if move is in database");

        const query = "SELECT * FROM move WHERE move_name = ?";

        // Wait until this process is finished (without async and promise the function will finish before query) <- promise used for tell the porgram that it will give the results later
        const [results] = await this.#connection.promise().execute(query, [moveName]);

        return results.length > 0;
    }

    /**
     * Retrieve information of the pokemon
     *
     * @param {string} pokemonName - Name of the pokemon
     * @returns {object} Infomration of the pokemon
     */
    async getPokemon(pokemonName) {
        console.log("Retrieving information of the pokemon");

        const query = "SELECT * FROM pokemon WHERE pokemon_name = ?";

        // Wait until this process is finished (without async and promise the function will finish before query) <- promise used for tell the porgram that it will give the results later
        const [results] = await this.#connection.promise().execute(query, [pokemonName]);

        // Return the first instance of the information
        return results[0];
    }

    /**
     * Retrieve all moves of the pokemon
     *
     * @param {string} pokemonName - Name of the pokemon
     * @returns {object[]} All moves of the pokemon
     */
    async getPokemonMoves(pokemonName) {
        console.log("Retrieving moves of the pokemon");

        const query = "SELECT move_id, move_name, power, accuracy FROM (pokemon NATURAL JOIN has) NATURAL JOIN move WHERE pokemon_name = ?";

        // Wait until this process is finished (without async and promise the function will finish before query) <- promise used for tell the porgram that it will give the results later
        const [results] = await this.#connection.promise().execute(query, [pokemonName]);

        return results;
    }

    /**
     * Insert information of the pokemon into the database
     *
     * @param {number} id - Unique identifier of the pokemon
     * @param {string} name - Name of the pokemon
     * @param {number} hp - Health point of the pokemon
     */
    async insertPokemon(id, name, hp) {
        console.log("Inserting information of the pokemon");

        const query = "INSERT INTO pokemon VALUES (?, ?, ?)";

        // Wait for query to finish inserting the information
        await this.#connection.execute(query, [id, name, hp]);
    }

    /**
     * Insert information of the move into th database
     *
     * @param {number} id - Unique identifier of the move
     * @param {string} name - Name of the move
     * @param {number} power - Attrack strength of the move
     * @param {number} accuracy - Attack accuracy of the move
     */
    async insertMove(id, name, power, accuracy) {
        // PokeAPI has null for some power
        if (power == null)
            power = 0

        // PokeAPI has null for some accuracy
        if (accuracy == null)
            accuracy = 0

        console.log("Inserting information of the move");

        const query = "INSERT INTO move VALUES (?, ?, ?, ?)";

        // Wait for query to finish inserting the information
        await this.#connection.execute(query, [id, name, power, accuracy]);
    }

    /**
     * Insert "has" relationship between pokemon and move
     *
     */
    async insertHas(pokemonId, moveId) {
        console.log("Inserting relationship between pokemon and move");

        const query = "INSERT INTO has VALUES (?, ?)";

        // Wait for query to fininsh inserting the relationship
        await this.#connection.execute(query, [pokemonId, moveId]);
    }
}
