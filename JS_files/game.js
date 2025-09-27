const gameArea = document.getElementById("gameScreen");
const player = document.getElementById("player");

const scoreDisp = document.getElementById("score");
const healthDisp = document.getElementById("health");

const resumebt = document.getElementById("resume");
const retrybt = document.getElementById("retry");

const gameOverScreen = document.getElementById("game-end-pause");
const gameOverText = document.getElementById("end-pause-text")

let score = 0;
let health = 100;
let playerSpeed = 2;
let enemySpeed = 1;
let gameRunning = true;
let gameEnded = false;

document.addEventListener("keydown" , function(event) {
    if (event.key === 'Escape') { PauseGame(); }
});

function PauseGame() {
    if (gameEnded) {return;}
    gameRunning = false;
    gameOverScreen.style.display = "block";
    gameOverText.textContent = "Paused";
}

function ResumeGame() {
    gameRunning = true;
    gameOverScreen.style.display = "none";
    gameOverText.textContent = "";
}

function GameOver() {
    gameEnded = true;
    gameRunning = false;
    gameOverScreen.style.display = "block";
    gameOverText.textContent = "Game Over";
    resumebt.disabled = true;
}