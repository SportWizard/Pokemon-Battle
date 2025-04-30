import Move from "./move.js";

/**
 * Represents a pokemon
 */
export default class Pokemon {
    #id;
    #name;
    #hp;
    #moves;

    /**
     * Initialize pokemon
     *
     * @param {number} id - Unique indentifier of the pokemon
     * @param {string} name - Name of the pokemon
     * @param {number} hp - Health point of hte pokemon
     */
    constructor(id, name, hp) {
        this.#id = id;
        this.#name = name;
        this.#hp = hp;
        this.#moves = {};
    }

    /**
     * Add a new move to the pokemon (max 4)
     *
     * @param {Move} move - Attack move
     */
    addMove(move) {
        if (Object.keys(this.#moves).length < 4)
            this.#moves[move.name] = move;
    }

    /**
     * Get id of the pokemon
     */
    get id() {
        return this.#id;
    }

    /**
     * Get name of the pokemon
     */
    get name() {
        return this.#name;
    }

    /**
     * Get health point of the pokemon
     */
    get hp() {
        return this.#hp
    }

    /**
     * Get moves of the pokemon
     */
    get moves() {
        // Encapsulate to prevent modification
        let movesCopy = {};

        for (const [moveName, move] of Object.entries(this.#moves))
            movesCopy[moveName] = Move.copy(move);

        return movesCopy;
    }
}
