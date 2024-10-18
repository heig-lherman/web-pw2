import { cellPixelSize, gameCols, gameRows, shapeColors } from "./constants.js";
import { Shape } from "./shape.js";

function cellToPixel(x) {
    return x * cellPixelSize;
}

export class Renderer {
    constructor(game, context) {
        this.game = game;
        this.context = context;
    }

    /**
     * Clears the context and draws all falling and dropped shapes.
     */
    render() {
        this.#resetContext();
        this.#drawShapes();
        this.#drawGround();
    }

    /**
     * Utility method for getting the game map's dimensions.
     * @returns {Array<number>} An array of coordinates of the current falling game, given its rotation.
     */
    #mapRect() {
        return [
            0, // x1
            0, // y1
            cellToPixel(gameCols), // x2
            cellToPixel(gameRows), // y2
        ];
    }

    /**
     * Resets the context by clearing the whole canvas.
     */
    #resetContext() {
        this.context.clearRect(...this.#mapRect());
    }

    /**
     * Draws the falling shapes
     */
    #drawShapes() {
        this.game.forEachShape((shape) => this.#drawShape(shape));
    }

    /**
     * Draws a shape on the canvas.
     * @param {Shape} shape the shape to draw
     */
    #drawShape(shape) {
        const coords = shape.getCoordinates();
        coords.forEach(([dx, dy]) => {
            this.#drawCell(shape.playerId, shape.row + dy, shape.col + dx);
        });
    }

    /**
     * Draws the grounded shapes on the canvas.
     */
    #drawGround() {
        const { map } = this.game;
        for (let row = map.height - 1; row >= 0; row--) {
            for (let col = 0; col < map.width; col++) {
                const playerId = map.getPlayerAt(row, col);
                if (playerId > -1) {
                    this.#drawCell(playerId, row, col);
                }
            }
        }
    }

    /**
     * Draws a cell on the canvas.
     * @param {number} playerId the player id to use, for color
     * @param {number} row the y cell index
     * @param {number} col the x cell index
     */
    #drawCell(playerId, row, col) {
        this.context.fillStyle = shapeColors[playerId];
        this.context.fillRect(
            cellToPixel(col),
            cellToPixel(row),
            cellPixelSize,
            cellPixelSize,
        );
    }
}
