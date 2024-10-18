import { Renderer } from "./renderer.js";
import { Game } from "./game.js";
import { PlayerInfo } from "./playerInfo.js";
import { GameMap } from "./gameMap.js";
import { gameCols, gameRows, stepIntervalMs } from "./constants.js";

const playerId = 0;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const game = new Game(new GameMap(gameCols, gameRows));
const player = new PlayerInfo(playerId);
const renderer = new Renderer(game, context);

game.set(playerId, player);
game.addNewShape(playerId);

const renderLoop = () => {
    renderer.render();
    window.requestAnimationFrame(renderLoop);
};

const gameLoop = () => {
    game.step();
    setTimeout(gameLoop, stepIntervalMs);
};

window.requestAnimationFrame(renderLoop);
setTimeout(gameLoop, stepIntervalMs);
