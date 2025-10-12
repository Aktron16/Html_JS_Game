const canvas = document.getElementById("gameScreen");
const context = canvas.getContext('2d');

const scoreDisp = document.getElementById("score");
const healthDisp = document.getElementById("health");


// World Dimensions
const World = {w: 3000 , h: 2000};
const camView = {w: innerWidth, h: innerHeight, x:0,y:0};

let score = 0;
let health = 100;
let gameRunning = true;
let gameEnded = false;

// Enemy Data sets
let enemies = [];
let item = [];

// Function helpers
const Clamp = (v,min,max) => Math.max(min,Math.min(max,v));
const toScreenX = x => Math.floor(x - camView.x);
const toScreenY = y => Math.floor(y - camView.y);


// Resizing the Window
function resize() {
    canvas.width = camView.w = innerWidth;
    canvas.height = camView.h = innerHeight;
}
addEventListener('resize', resize);
resize();

function updateCamera() {
    camView.x = player.x + player.w/2 - camView.w/2;
    camView.y = player.y + player.h/2 - camView.h/2;
    camView.x = Clamp (camView.x, 0 ,Math.max(0,World.w-camView.w));
    camView.y = Clamp (camView.y, 0 ,Math.max(0,World.h-camView.h));
}


// Keyboard Input
let keys = new Set();
document.addEventListener("keydown" , e => {
    keys.add(e.key.toLowerCase());
    if (e.key === 'Escape') PauseGame();
});

document.addEventListener("keyup", e => {
    keys.delete(e.key.toLowerCase());
});

// Player Class
class Player {
    constructor(x,y,w,h,baseSpeed,color){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.baseSpeed = baseSpeed
        this.color = color
    };
    // Function to Move the Player..
    Move(dt, keys){
        let xDir = 0, yDir = 0;

        if (keys.has('w')) yDir-=1;
        if (keys.has('a')) xDir-=1;
        if (keys.has('s')) yDir+=1;
        if (keys.has('d')) xDir+=1;

        if (xDir !== 0 || yDir !== 0){
            const normal = Math.hypot(xDir,yDir)
            xDir /= normal;
            yDir /= normal;
        }

        this.x += xDir * this.baseSpeed * dt;
        this.y += yDir * this.baseSpeed * dt;

        this.x = Clamp(this.x , 0 , World.w - this.w);
        this.y = Clamp(this.y, 0, World.h - this.h);
        console.log(this.x , this.y)
    };

    Draw(context, toScreenX, toScreenY) {
        context.fillStyle = this.color;
        context.fillRect(toScreenX(this.x),toScreenY(this.y),this.w,this.h);
    };

};


function drawBackground() {
    context.fillStyle = '#24ec2bff'
    context.fillRect(0,0,camView.w,camView.h)
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

// Variables for game entities;
const player = new Player(World.w/2 ,World.h/2 ,32 ,32, 250, '#ffffffff');

let last = performance.now();
function loop(now) {
    const dt = Math.min(1 / 30 ,(now-last)/1000);
    last = now;

    player.Move(dt,keys);
    updateCamera();
    
    drawBackground();
    player.Draw(context, toScreenX , toScreenY);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

healthDisp.textContent = "Health : " + health;