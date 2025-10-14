const canvas = document.getElementById("gameScreen");
const context = canvas.getContext('2d');

const scoreDisp = document.getElementById("score");
const healthDisp = document.getElementById("health");


// World Dimensions
const World = {w: 6400 , h: 6400};
const gridSize = 64;
let grassMap = [];
const camView = {w: innerWidth, h: innerHeight, x:0,y:0};

const grassBlockPaths = [
    {name: 'grass1', path: '../Assets/Map_Assets/Grass1.png' },
    {name: 'grass2', path: '../Assets/Map_Assets/Grass2.png' },
    {name: 'grass3', path: '../Assets/Map_Assets/Grass3.png' },
    {name: 'grass4', path: '../Assets/Map_Assets/Grass4.png' },
    {name: 'commongrass', path: '../Assets/Map_Assets/CommonGrassBlock.png' }
];
const grassBlocks = []
grassBlockPaths.forEach(g => {
    const img = new Image();
    img.src = g.path;
    grassBlocks.push(img);
})

let gameRunning = true;
let gameEnded = false;

// Function helpers
const Clamp = (v,min,max) => Math.max(min,Math.min(max,v));
const toScreenX = x => Math.floor(x - camView.x);
const toScreenY = y => Math.floor(y - camView.y);


// Resizing the Window
function resize() {
    canvas.width = camView.w = innerWidth;
    canvas.height = camView.h = innerHeight;
};
addEventListener('resize', resize);
resize();

function updateCamera() {
    camView.x = player.x + player.w/2 - camView.w/2;
    camView.y = player.y + player.h/2 - camView.h/2;
    camView.x = Clamp (camView.x, 0 ,Math.max(0,World.w-camView.w));
    camView.y = Clamp (camView.y, 0 ,Math.max(0,World.h-camView.h));
};


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
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.baseSpeed = baseSpeed;
        this.color = color;
        this._health = 100;
        this._score = 0;
    };

    get health() {
        return this._health;
    };

    set health(newHealth) {

        if (newHealth <= 0) {
            console.log("Player should be Dead."); //Going to add a death state later on
        };

        this._health = Clamp(newHealth, 0 , 100);
        if (healthDisp) {
            healthDisp.textContent = "Health : " + this._health;
        };
    };

    get score() {
        return this._score;
    };

    set score(newScore) {

        this._score = newScore;
        if (scoreDisp) {
            scoreDisp.textContent = "Score : " + this._score;
        }
    }
    // Function to Move the Player..
    move(dt){
        let xDir = 0, yDir = 0;

        if (keys.has('w')) yDir-=1;
        if (keys.has('a')) xDir-=1;
        if (keys.has('s')) yDir+=1;
        if (keys.has('d')) xDir+=1;

        if (xDir !== 0 || yDir !== 0){
            const normal = Math.hypot(xDir,yDir)
            xDir /= normal;
            yDir /= normal;
        };

        this.x += xDir * this.baseSpeed * dt;
        this.y += yDir * this.baseSpeed * dt;

        this.x = Clamp(this.x , 0 , World.w - this.w);
        this.y = Clamp(this.y, 0, World.h - this.h);
        // console.log(this.x , this.y)
    };

    draw() {
        context.fillStyle = this.color;
        context.fillRect(toScreenX(this.x),toScreenY(this.y),this.w,this.h);
    };

    collisionDetection(obj) {
        return !( //Only returns true if any one of them is false
            this.x + this.w < obj.x || //Checks if the object at the right of the player is colliding
            this.x > obj.x + obj.w || //Checks if the object at the left of the player is colliding
            this.y + this.h < obj.y || //Checks if the object at the botton of the player is colliding
            this.y > obj.y + obj.h //Checks if the object at the top of the player is colliding
        );
    };
};

class Gem {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = this.h = 30;
        this.value = 1;
        this.collected = false;

        this.asset = new Image();
        this.asset.src = '../Assets/gem-1.png';
    };

    draw() {
        if (this.collected) return;

        if (this.asset.complete) {
            context.drawImage(
                this.asset,
                toScreenX(this.x),
                toScreenY(this.y),
                this.w,
                this.h
            );
        } else {
            context.fillStyle = 'yellow';
            context.fillRect(toScreenX(this.x),toScreenY(this.y),this.w,this.h)
        };
    };

    checkCollected(player) {
        if (this.collected) return false;

        if (player.collisionDetection(this)) {
            this.collected = true;
            player.score += this.value;
            return true;            
        };

        return false;
    };
};

class GemManager {
    constructor(amt) {
        this.gems = [];
        this.amt = amt;
        this.spawnall();
    };

    spawnall() {
        for (let i=0; i < this.amt; i++) {this.spawnone()};
    };

    spawnone() {
        const randx = Math.random() * (World.w - 30);
        const randy = Math.random() * (World.h - 30);
        this.gems.push(new Gem(randx,randy));
    };

    update(player) {
        this.gems.forEach(gem => { 
            if (gem.checkCollected(player)) {
                this.spawnone();
            };
        });

        this.gems = this.gems.filter(gem => !gem.collected);
    };

    draw() {
        this.gems.forEach(gem => gem.draw());
    };
};

function generateGrassMap() {
    for (let y = 0; y < Math.ceil(World.h/gridSize); y++) {
        let row = []
        for (let x = 0; x < Math.ceil(World.w/gridSize); x++) {
            const randrow = Math.floor(Math.random() * grassBlocks.length);
            row.push(grassBlocks[randrow]);
        };
        grassMap.push(row);
    };
    console.log("Grass Map Generated");
};

function drawGrassMap() {
    for (let x = 0; x < World.w; x += gridSize) {
        for (let y = 0; y < World.h; y += gridSize) {
            context.drawImage(
                grassMap[Math.floor(x/gridSize)][Math.floor(y/gridSize)],
                toScreenX(x),
                toScreenY(y),
                gridSize,
                gridSize
            );
        };
    };
};

function drawBgGrid() {
    context.strokeStyle = "#4a893eff";
    context.lineWidth = 1;

    const startX = Math.floor(camView.x / gridSize) * gridSize;
    const startY = Math.floor(camView.y / gridSize) * gridSize;

    // Vertical lines
    for (let x = startX; x <= camView.x + camView.w; x += gridSize) {
        context.beginPath();
        context.moveTo(toScreenX(x), 0);
        context.lineTo(toScreenX(x), camView.h);
        context.stroke();
    };

    // Horizontal lines
    for (let y = startY; y <= camView.y + camView.h; y += gridSize) {
        context.beginPath();
        context.moveTo(0, toScreenY(y));
        context.lineTo(camView.w, toScreenY(y));
        context.stroke();
    };
};


// Function to Pause the Game
function PauseGame() {
    if (gameEnded) {return;}
    gameRunning = false;
    gameOverScreen.style.display = "flex";
    gameOverText.textContent = "Paused";
};

// Function to Resume the Game
function ResumeGame() {
    gameRunning = true;
    gameOverScreen.style.display = "none";
    gameOverText.textContent = "";
};

// Game Over Function
function GameOver() {
    gameEnded = true;
    gameRunning = false;
    gameOverScreen.style.display = "block";
    gameOverText.textContent = "Game Over";
    resumebt.disabled = true;
};

// Variables for game entities;
const player = new Player(World.w/2 ,World.h/2 ,32 ,32, 250, '#ffffffff');
const spawngems = new GemManager(100);

let last = performance.now();
function loop(now) {
    const dt = Math.min(1 / 30 ,(now-last)/1000);
    last = now;

    if (!gameRunning) return;

    player.move(dt);
    spawngems.update(player);
    updateCamera();
    
    drawGrassMap();
    drawBgGrid();
    spawngems.draw();
    player.draw();

    requestAnimationFrame(loop);
};
generateGrassMap();
requestAnimationFrame(loop);

healthDisp.textContent = "Health : " + player.health;
scoreDisp.textContent = "Score : " + player.score;