import axios from "axios";

/**
 * PokeAPI request
 */
export default class PokeAPI {
    /**
     * Request information of pokemon from PokeAPI
     *
     * @param {string} pokemonName - Name of the pokemon
     * @returns {object} An object containing information of the pokemon
     */
    static async getPokemonFromAPI(pokemonName) {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        let resData = null;

        try {
            const res = await axios.get(url);

            if (res.status !== 200)
                throw new Error("External API request failed. Status:", res.status);

            console.log("External API request successful. Pokemon:", pokemonName);

            resData = res.data;
        }
        catch (err) {
            throw err;
        }

        return resData;
    }

    /**
     * Request information of move from PokeAPI
     *
     * @param {*} moveName - Name of the move
     * @returns {object} An object containing information of the move
     */
    static async getMoveFromApi(moveName) {
        const url = `https://pokeapi.co/api/v2/move/${moveName}`;
        let resData = null;

        try {
            const res = await axios.get(url);

            if (res.status !== 200)
                throw new Error("External API request failed. Status:", res.status);

            console.log("External API request successful. Move:", moveName);

            resData = res.data;
        }
        catch (err) {
            throw err;
        }

        return resData;
    }
}
