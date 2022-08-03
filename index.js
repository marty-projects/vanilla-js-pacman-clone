import {LEVEL, OBJECT_TYPE} from './setup.js';
import { randomMovement } from './GhostMoves.js';

import Gameboard from './Gameboard.js';
import Pacman from './Pacman.js';
import Ghost from './Ghost.js';

import soundDot from './static/sounds/munch.mp3';
import soundPill from './static/sounds/pill.mp3';
import soundGameStart from './static/sounds/game_start.mp3';
import soundGameOver from './static/sounds/death.mp3';
import soundGhost from './static/sounds/eat_ghost.mp3';

//DOM
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

//Constants
const POWER_PILL_TIME = 10000;
const GLOBAL_SPEED = 80;
const gameboard = Gameboard.createGameboard(gameGrid, LEVEL);

//Initialize
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;
//AUDIO
function playAudio(audio) {
    const soundEffect = new Audio(audio);
    soundEffect.play();
}
//GAME CONTROLLER
function gameOver(pacman) {
    playAudio(soundGameOver);
    document.removeEventListener('keydown', (e) => 
        pacman.handleKeyInput(e, gameboard.objectExists.bind(gameboard))
    );
    gameboard.showGameStatus(gameWin);
    clearInterval(timer);
    startButton.classList.remove('hide');
};

function checkCollision(pacman, ghosts) {
    const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos);
    if(collidedGhost) {
        if(pacman.powerPill) {
            playAudio(soundGhost);
            gameboard.removeObject(collidedGhost.pos, [
                OBJECT_TYPE.GHOST,
                OBJECT_TYPE.SCARED,
                collidedGhost.name
            ]);
            collidedGhost.pos = collidedGhost.startPos;
            score += 100;
        } else {
        gameboard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
        gameboard.rotateDiv(pacman.pos,0);
        gameOver(pacman,gameGrid);
        }
    }
}

function gameLoop(pacman, ghosts) {
    gameboard.moveCharacter(pacman);
    ghosts.forEach((ghost) => gameboard.moveCharacter(ghost))
    checkCollision(pacman,ghosts);

    if (gameboard.objectExists(pacman.pos, OBJECT_TYPE.DOT)) {
        playAudio(soundDot);
        gameboard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        gameboard.dotCount--;
        score += 10;
    }

    if (gameboard.objectExists(pacman.pos, OBJECT_TYPE.PILL)) {
        playAudio(soundPill);
        gameboard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
        pacman.powerPill = true;
        score += 50;
        clearTimeout(powerPillTimer);
        powerPillTimer = setTimeout(
            () => 
                () => (pacman.powerPill = false),
                POWER_PILL_TIME
        );
    }
    if (pacman.powerPill !== powerPillActive) {
        powerPillActive = pacman.powerPill;
        ghosts.forEach(ghost => (ghost.isScared = pacman.powerPill));
    }
    if(gameboard.dotCount === 0) {
        gameWin = true;
        gameOver(pacman, ghosts);
    }
    scoreTable.innerHTML = score;
}
function startGame() {
    playAudio(soundGameStart);
    gameWin =false;
    powerPillActive = false;
    score= 0;
    startButton.classList.add('hide');
    gameboard.createGrid(LEVEL);
    const pacman = new Pacman(2, 287);
    gameboard.addObject(287, [OBJECT_TYPE.PACMAN]);
    document.addEventListener('keydown', (e) => 
        pacman.handleKeyInput(e, gameboard.objectExists));
    const ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ];
    timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED)
}
//Start

startButton.addEventListener('click', startGame)

