import { gameRows, gameCols } from "./constants.js";
import { Shape } from "./shape.js";
import { GameMap } from "./gameMap.js";

export class Game extends Map {
    constructor(gameMap) {
        super();
        this.map = gameMap;
        this.isGameOver = false;
    }

    /**
     * Returns shape of given player, or undefined if no such player or shape.
     * @param {Number} id Id of the player whose shape is to be returned.
     */
    getShape(id) {
        return this.get(id)?.shape;
    }

    /**
     * Executes the provided function on each shape in the game.
     * @param {Function} f The function to be executed. It takes a shape as unique parameters, and its return value is ignored.
     */
    forEachShape(f) {
        this.forEach((player) => f(player.shape));
    }

    /**
     * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
     * @param {Number} playerId The id of the player whose shape should be dropped
     */
    dropShape(playerId) {
        const player = this.get(playerId);
        if (!player) {
            return;
        }

        this.map.dropShape(player.shape);
        this.map.clearFullRows();
        this.addNewShape(playerId);
        this.#replaceBlockedShapes(playerId);
    }

    /**
     * Replace blocked shapes of all players except the one with the given id.
     * @param {number} selfId Id of the player whose shape should not be replaced.
     */
    #replaceBlockedShapes(selfId) {
        this.forEach((player, playerId) => {
            if (playerId !== selfId && !this.map.testShape(player.shape)) {
                this.addNewShape(playerId);
            }
        });
    }

    /**
     * Advances the game by one step, i.e. moves all shapes down by one, drops any shape that was touching the ground, and replace it with a new one.
     */
    step() {
        if (this.isGameOver) {
            return;
        }

        const dropShapes = [];
        for (let player of this.values()) {
            const { shape } = player;
            if (!shape || shape.row === undefined) {
                continue;
            }

            if (this.map.testShape(shape, shape.row + 1)) {
                shape.row++;
                continue;
            }

            dropShapes.push(shape);
        }

        dropShapes.forEach((shape) => {
            if (this.map.testShape(shape)) {
                this.dropShape(shape.playerId);
            }
        });
    }

    /**
     * Replace current shape of given player id (if any) with a new random shape.
     * @param {Number} id Id of the player whose shape should be replaced.
     */
    addNewShape(id) {
        const player = this.get(id);
        if (!player) {
            return;
        }

        const shapeCol = this.map.width / 2;
        const type = Shape.getRandomShapeType();
        player.shape = new Shape(type, id, shapeCol, 0, 0);

        if (!this.map.testShape(player.shape)) {
            this.gameOver();
        }
    }

    /**
     * Resets the game upon game over.
     */
    gameOver() {
        this.isGameOver = true;
        this.clear();
        this.map = new GameMap(gameCols, gameRows);
    }
}
