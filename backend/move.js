export default class Move {
    #id;
    #name;
    #power;
    #accuracy;

    /**
     * Create a new move
     * @param {number} id - Unique identifier for the move
     * @param {string} name - Name of the move
     * @param {number} power - Attack strength of the move
     * @param {number} accuracy - Accuracy percentage of hit
     */
    constructor(id, name, power, accuracy) {
        this.#id = id;
        this.#name = name;
        this.#power = power;
        this.#accuracy = accuracy;
    }

    /**
     * Create a new copy of the move
     *
     * @param {Move} move - original move to be copied
     */
    static copy(move) {
        return new Move(move.id, move.name, move.power, move.accuracy);
    }

    /**
     * Get id of the move
     */
    get id() {
        return this.#id;
    }

    /**
     * Get name of the move
     */
    get name() {
        return this.#name;
    }

    /**
     * Get power of the move
     */
    get power() {
        return this.#power;
    }

    /**
     * Get accuracy of the move
     */
    get accuracy() {
        return this.#accuracy;
    }
}
