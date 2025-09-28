const gameArea = document.getElementById("gameScreen");
const player = document.getElementById("player");

const scoreDisp = document.getElementById("score");
const healthDisp = document.getElementById("health");
const resumebt = document.getElementById("resume");
const retrybt = document.getElementById("retry");
const gameOverScreen = document.getElementById("game-end-pause");
const gameOverText = document.getElementById("end-pause-text")

// Variables for game entities
let score = 0;
let health = 100;
let playerSpeed = 2;
let enemySpeed = 1;
let gameRunning = true;
let gameEnded = false;

// Some Initialisations
let playerPos = { x: 385, y: 285};
let keys ={};

let enemies = [];
let item = [];


// Pressing ESC to pause the game...
document.addEventListener("keydown" , function(event) {
    keys[event.key] = true;
    if (event.key === 'Escape') PauseGame();
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});


// Function to Move the Player..
function playerMovementInput() {
    if (keys["W"] || keys["w"]) playerPos.y -= playerSpeed;
    if (keys["S"] || keys["s"]) playerPos.y += playerSpeed;
    if (keys["A"] || keys["a"]) playerPos.x -= playerSpeed;
    if (keys["D"] || keys["d"]) playerPos.x += playerSpeed;

    const maxX = gameArea.clientWidth - player.offsetWidth;
    const maxY = gameArea.clientHeight - player.offsetHeight;

    playerPos.x = Math.max(0, Math.min(maxX,playerPos.x));
    playerPos.y = Math.max(0, Math.min(maxY,playerPos.y));

    player.style.left = playerPos.x + "px";
    player.style.top = playerPos.y + "px";
}


// Function to Pause the Game
function PauseGame() {
    if (gameEnded) {return;}
    gameRunning = false;
    gameOverScreen.style.display = "flex";
    gameOverText.textContent = "Paused";
}

// Function to Resume the Game
function ResumeGame() {
    gameRunning = true;
    gameOverScreen.style.display = "none";
    gameOverText.textContent = "";
}

// Game Over Function
function GameOver() {
    gameEnded = true;
    gameRunning = false;
    gameOverScreen.style.display = "block";
    gameOverText.textContent = "Game Over";
    resumebt.disabled = true;
}


function gameLoop() {
    if (!gameRunning) {
        requestAnimationFrame(gameLoop)
        return;
    }

    playerMovementInput();
    requestAnimationFrame(gameLoop);
}

healthDisp.textContent = "Health : " + health;
gameLoop();