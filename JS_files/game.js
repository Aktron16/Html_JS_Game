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
const randomChoice = (...choices) => choices[Math.floor(Math.random()*choices.length)];
function mapImg(imgsArray) {
    return imgsArray.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });
};
function audioImport(audioArray) {
    return audioArray.map(src => {
        const audio = new Audio();
        audio.src = src;
        audio.volume = 0.4;
        return audio;
    });
};

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
    if (e.key === 'Escape') TogglePauseGame();
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

        this.state = 'idle'; //idle , walk-right, walk-left, walk-up, walk-down
        this.frameindex = 0;
        this.frametime = 0;
        this.frameduration = 100; //animation framerate

        this.animations = {
            idle: mapImg([
                '../Assets/Player_Animations/Idle/idle0.png',
                '../Assets/Player_Animations/Idle/idle1.png',
                '../Assets/Player_Animations/Idle/idle2.png',
                '../Assets/Player_Animations/Idle/idle3.png',
                '../Assets/Player_Animations/Idle/idle4.png',
                '../Assets/Player_Animations/Idle/idle5.png',
                '../Assets/Player_Animations/Idle/idle6.png',
                '../Assets/Player_Animations/Idle/idle7.png',
                '../Assets/Player_Animations/Idle/idle8.png',
                '../Assets/Player_Animations/Idle/idle9.png',
                '../Assets/Player_Animations/Idle/idle10.png',
                '../Assets/Player_Animations/Idle/idle11.png'
            ]),

            walk_up: mapImg([
                '../Assets/Player_Animations/Walk-Up/walk-up0.png',
                '../Assets/Player_Animations/Walk-Up/walk-up1.png',
                '../Assets/Player_Animations/Walk-Up/walk-up2.png',
                '../Assets/Player_animations/Walk-Up/walk-up3.png',
                '../Assets/Player_animations/Walk-Up/walk-up4.png',
                '../Assets/Player_animations/Walk-Up/walk-up5.png',
                '../Assets/Player_animations/Walk-Up/walk-up6.png',
                '../Assets/Player_animations/Walk-Up/walk-up7.png'
            ]),

            walk_down: mapImg([
                '../Assets/Player_animations/Walk-Down/walk-down0.png',
                '../Assets/Player_animations/Walk-Down/walk-down1.png',
                '../Assets/Player_animations/Walk-Down/walk-down2.png',
                '../Assets/Player_animations/Walk-Down/walk-down3.png',
                '../Assets/Player_animations/Walk-Down/walk-down4.png',
                '../Assets/Player_animations/Walk-Down/walk-down5.png',
                '../Assets/Player_animations/Walk-Down/walk-down6.png',
                '../Assets/Player_animations/Walk-Down/walk-down7.png'
            ]),

            walk_right: mapImg([
                '../Assets/Player_animations/Walk-Right/walk-right0.png',
                '../Assets/Player_animations/Walk-Right/walk-right1.png',
                '../Assets/Player_animations/Walk-Right/walk-right2.png',
                '../Assets/Player_animations/Walk-Right/walk-right3.png',
                '../Assets/Player_animations/Walk-Right/walk-right4.png',
                '../Assets/Player_animations/Walk-Right/walk-right5.png',
                '../Assets/Player_animations/Walk-Right/walk-right6.png',
                '../Assets/Player_animations/Walk-Right/walk-right7.png'
            ]),

            walk_left: mapImg([
                '../Assets/Player_animations/Walk-Left/walk-left0.png',
                '../Assets/Player_animations/Walk-Left/walk-left1.png',
                '../Assets/Player_animations/Walk-Left/walk-left2.png',
                '../Assets/Player_animations/Walk-Left/walk-left3.png',
                '../Assets/Player_animations/Walk-Left/walk-left4.png',
                '../Assets/Player_animations/Walk-Left/walk-left5.png',
                '../Assets/Player_animations/Walk-Left/walk-left6.png',
                '../Assets/Player_animations/Walk-Left/walk-left7.png'
            ])
        };

        this.sfx = {
            gem_pickup: audioImport(['../Assets/Music_Sfx/Sfx/retro-coin-4-236671.mp3']),
            hurt: audioImport(['../Assets/Music_Sfx/Sfx/retro-hurt-2-236675.mp3'])
        };
    };

    get health() {return this._health;};

    set health(newHealth) {

        if (newHealth <= 0) {
            console.log("Player is Dead. Score is " + this._score + "."); //Going to add a death state later on
            gameEnded = true;
        };

        this._health = Clamp(newHealth, 0 , 100);
        if (healthDisp) {
            healthDisp.textContent = "Health : " + this._health;
        };
    };

    dmgPlayer(dmg) {
        this.health -= dmg;
        this.sfx.hurt[0].currentTime = 0;
        this.sfx.hurt[0].play().catch(() => {});
    }

    get score() {return this._score;};

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

        const isMoving = (xDir !== 0 || yDir !== 0);
        
        if (!isMoving) {
            this.state = 'idle';
        } else {
            if (Math.abs(xDir) > Math.abs(yDir)) {
                this.state = (xDir > 0) ? 'walk_right' : 'walk_left';
            } else {
            this.state = (yDir > 0) ? 'walk_down' : 'walk_up';
            };
        };

        if (isMoving) {
            const normal = Math.hypot(xDir,yDir)
            xDir /= normal;
            yDir /= normal;
            this.x += xDir * this.baseSpeed * dt;
            this.y += yDir * this.baseSpeed * dt;
        };

        this.x = Clamp(this.x , 0 , World.w - this.w);
        this.y = Clamp(this.y, 0, World.h - this.h);
        // console.log(this.x , this.y)

        this.updateAnimations(dt);
    };

    updateAnimations(dt) {
        this.frametime += dt * 1000;
        if (this.frametime >= this.frameduration) {
            this.frametime = 0;
            const frames = this.animations[this.state];
            this.frameindex = (this.frameindex + 1) % frames.length;
        };
    };

    draw() {
        const frames = this.animations[this.state];
        const frame = frames[this.frameindex];

        if (frame && frame.complete) {
            context.drawImage(frame, toScreenX(this.x) - 48, toScreenY(this.y) - 48, (this.w + 96), (this.h + 96));
        } else {
            context.fillStyle = this.color;
            context.fillRect(toScreenX(this.x),toScreenY(this.y),this.w,this.h);
        };
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

class Enemies {
    constructor (x, y, w, h, baseSpeed, damage, color, type) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.baseSpeed = baseSpeed;
        this.damage = damage;
        this.color = color;
        this.attacked = false;
        this.type = type;

        this.state = this.type + '_right';
        this.frameindex = 0;
        this.frametime = 0;
        this.frameduration = 100;

        this.animations = {

            ant_right: mapImg([
                '../Assets/Enemy_Animations/Ant-Right/ant-1-flipped.png',
                '../Assets/Enemy_Animations/Ant-Right/ant-2-flipped.png',
                '../Assets/Enemy_Animations/Ant-Right/ant-3-flipped.png',
                '../Assets/Enemy_Animations/Ant-Right/ant-4-flipped.png',
                '../Assets/Enemy_Animations/Ant-Right/ant-5-flipped.png',
                '../Assets/Enemy_Animations/Ant-Right/ant-6-flipped.png',
                '../Assets/Enemy_Animations/Ant-Right/ant-7-flipped.png',
                '../Assets/Enemy_Animations/Ant-Right/ant-8-flipped.png'
            ]),

            ant_left: mapImg([
                '../Assets/Enemy_Animations/Ant-Left/ant-1.png',
                '../Assets/Enemy_Animations/Ant-Left/ant-2.png',
                '../Assets/Enemy_Animations/Ant-Left/ant-3.png',
                '../Assets/Enemy_Animations/Ant-Left/ant-4.png',
                '../Assets/Enemy_Animations/Ant-Left/ant-5.png',
                '../Assets/Enemy_Animations/Ant-Left/ant-6.png',
                '../Assets/Enemy_Animations/Ant-Left/ant-7.png',
                '../Assets/Enemy_Animations/Ant-Left/ant-8.png'
            ]),

            bat_right: mapImg([
                '../Assets/Enemy_Animations/Bat-Right/bat-fly1.png',
                '../Assets/Enemy_Animations/Bat-Right/bat-fly2.png',
                '../Assets/Enemy_Animations/Bat-Right/bat-fly3.png'
            ]),

            bat_left: mapImg([
                '../Assets/Enemy_Animations/Bat-Left/bat-fly1f.png',
                '../Assets/Enemy_Animations/Bat-Left/bat-fly2f.png',
                '../Assets/Enemy_Animations/Bat-Left/bat-fly3f.png'
            ]),

            bear_right: mapImg([
                '../Assets/Enemy_Animations/Bear-Right/bear-walk1.png',
                '../Assets/Enemy_Animations/Bear-Right/bear-walk1.png',
                '../Assets/Enemy_Animations/Bear-Right/bear-walk2.png',
                '../Assets/Enemy_Animations/Bear-Right/bear-walk2.png',
                '../Assets/Enemy_Animations/Bear-Right/bear-walk3.png',
                '../Assets/Enemy_Animations/Bear-Right/bear-walk3.png',
                '../Assets/Enemy_Animations/Bear-Right/bear-walk4.png',
                '../Assets/Enemy_Animations/Bear-Right/bear-walk4.png'
            ]),

            bear_left: mapImg([
                '../Assets/Enemy_Animations/Bear-Left/bear-walk1f.png',
                '../Assets/Enemy_Animations/Bear-Left/bear-walk1f.png',
                '../Assets/Enemy_Animations/Bear-Left/bear-walk2f.png',
                '../Assets/Enemy_Animations/Bear-Left/bear-walk2f.png',
                '../Assets/Enemy_Animations/Bear-Left/bear-walk3f.png',
                '../Assets/Enemy_Animations/Bear-Left/bear-walk3f.png',
                '../Assets/Enemy_Animations/Bear-Left/bear-walk4f.png',
                '../Assets/Enemy_Animations/Bear-Left/bear-walk4f.png'
            ])
        };
    };

    followPlayer(dt, player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx,dy);

        if (dist > 0) {
            const xDir = (dx / dist);
            const yDir = (dy / dist);
            this.state = (xDir > 0) ? this.type + '_right' : this.type + '_left';
            this.x += xDir * this.baseSpeed * dt;
            this.y += yDir * this.baseSpeed * dt;
        }
        this.x = Clamp(this.x , 0 , World.w - this.w);
        this.y = Clamp(this.y, 0, World.h - this.h);

        this.updateAnimations(dt);
    };

    updateAnimations(dt) {
        this.frametime += dt * 1000;
        if (this.frametime >= this.frameduration) {
            this.frametime = 0;
            const frames = this.animations[this.state];
            this.frameindex = (this.frameindex + 1) % frames.length;
        };
    };

    draw() {
        if (this.attacked) return;

        const frames = this.animations[this.state];
        const frame = frames[this.frameindex];

        if (frame && frame.complete) {
            context.drawImage(frame,toScreenX(this.x),toScreenY(this.y),this.w,this.h);
        } else {
            context.fillStyle = this.color;
            context.fillRect(toScreenX(this.x),toScreenY(this.y),this.w,this.h);
        };
    };

    checkCollision(player) {
        if (this.attacked) return false;

        if (player.collisionDetection(this)) {
            player.dmgPlayer(this.damage);
            this.attacked = true;
            return true;
        };
    };

    isColliding(obj) {
        return !( //Only returns true if any one of them is false
            this.x + this.w < obj.x || //Checks if the object at the right of the player is colliding
            this.x > obj.x + obj.w || //Checks if the object at the left of the player is colliding
            this.y + this.h < obj.y || //Checks if the object at the botton of the player is colliding
            this.y > obj.y + obj.h //Checks if the object at the top of the player is colliding
        );
    };

    enemyAvoidance(enemies) {
        for (let other of enemies) {
            if (other === this) continue;

            if (this.isColliding(other)) {
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const dist = Math.hypot(dx,dy) || 0.1;

                const minDist = (this.w + other.w) / 2;

                if (dist < minDist) {
                    const overlap = minDist - dist;

                    this.x += (dx / dist) * (overlap / 2);
                    this.x += (dy / dist) * (overlap / 2);
                    other.x -= (dx / dist) * (overlap / 2);
                    other.x -= (dy / dist) * (overlap / 2);
                };
            };
        };
    };
};

// The Gem Component
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
            player.sfx.gem_pickup[0].currentTime = 0;
            player.sfx.gem_pickup[0].play().catch(() => {});
            return true;            
        };

        return false;
    };
};

// The Game Manager (Spanws the Gems, Enemies)
class GameManager {
    constructor(thing, amt) {
        this.gems = [];
        this.enemies = [];
        this.amt = amt;
        this.thing = thing;
        this.spawnall(this.thing);
    };

    spawnall(obj) {
        for (let i=0; i < this.amt; i++) {
            if (obj == 'enemy') { 
                this.spawnone(randomChoice('enemy1','enemy2','enemy3'));
            } else {
                this.spawnone(obj);
            };
        };
    };

    spawnone(obj) {
        const randx = Math.random() * (World.w - 50);
        const randy = Math.random() * (World.h - 50);

        if (obj == 'gems') {
            this.gems.push(new Gem(randx,randy));
        } else if (obj == 'enemy1') {
            // This is the normal Enemy.
            this.enemies.push(new Enemies(randx,randy,37,31,125,5,'#ff0000ff','bat'));
        } else if (obj == 'enemy2') {
            // This is the Fast Enemy.
            this.enemies.push(new Enemies(randx,randy,20,20,200,1,'#ffc400ff','ant'));
        } else if (obj == 'enemy3') {
            // This is the Slow Enemy.
            this.enemies.push(new Enemies(randx,randy,55,64,90,10,'#00ff00ff','bear'));
        }
    };

    update(player) {
        this.gems.forEach(gem => { 
            if (gem.checkCollected(player)) {
                this.spawnone('gems');
            };
        });

        this.enemies.forEach(enemy => {
            if (enemy.checkCollision(player)) {
                this.spawnone(randomChoice('enemy1','enemy2','enemy3'));
            };            
        });

        this.enemies = this.enemies.filter(enemy => !enemy.attacked);
        this.gems = this.gems.filter(gem => !gem.collected);
    };

    draw() {
        this.gems.forEach(gem => gem.draw());
        this.enemies.forEach(enemy => enemy.draw());
    };

    followPlayer(dt, player) {
        this.enemies.forEach(enemy => enemy.followPlayer(dt, player));
        this.enemies.forEach(enemy => enemy.enemyAvoidance(this.enemies));
    };
};

class BGAudioManager {
    constructor() {
        this.bgMusic = audioImport([
            '../Assets/Music_Sfx/game-music-loop-8-145362.mp3',
            '../Assets/Music_Sfx/game-music-loop-9-145494.mp3',
            '../Assets/Music_Sfx/game-music-loop-10-145572.mp3',
            '../Assets/Music_Sfx/game-music-loop-7-145285.mp3'
        ]);

        this.currentTrack = 0;
    };

    playRandTrack() {
        this.currentTrack = Math.floor(Math.random() * this.bgMusic.length);
        this.playCurrent();
    };

    playCurrent() {
        this.bgMusic.forEach(track => {
            track.pause();
            track.currentTime = 0;
        });

        this.bgMusic[this.currentTrack].play().catch(() => {});
        this.bgMusic[this.currentTrack].onended = () => this.nextTrack();
    }
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.bgMusic.length;
        this.playCurrent();
    };

    pauseTrack() {
        this.bgMusic[this.currentTrack].pause();
    };

    resumeTrack() {
        this.bgMusic[this.currentTrack].play().catch(() => {});
    };

    resetTrack() {
        this.pauseTrack();
        this.bgMusic[this.currentTrack].currentTime = 0;
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
    context.strokeStyle = "#7d8348ff";
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
function TogglePauseGame() {
    if (gameEnded) {return;}
    gameRunning = !gameRunning;
    if (gameRunning) {
        last = performance.now();
        music.resumeTrack();
    } else {
        music.pauseTrack();
    };
};

function paused() {
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width,canvas.height);

    context.save();
    context.font = 'bold 32px sans-serif';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText('Paused', canvas.width / 2, canvas.height / 2);
    context.font = '16px sans-serif';
    context.fillText('Press Esc to Resume', canvas.width / 2, canvas.height / 2 + 32);
    context.restore();
}

// Game Over Function
function GameOver() {
    gameRunning = false;

    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width,canvas.height);

    context.save();
    context.font = 'bold 64px sans-serif';
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    context.font = '16px sans-serif';
    context.fillStyle = 'white';
    context.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 64);
    context.restore();
    music.resetTrack();
    Score_save();
};

function Score_save() {
    let user_current = JSON.parse(localStorage.getItem('User_Logged_in')) || null;
    let users = JSON.parse(localStorage.getItem('credentials')) || [];
    let leaderboards = JSON.parse(localStorage.getItem('Leaderboards')) || [];

    let nickname,email;
    if (user_current) {
        nickname = user_current._nickname;
        email = user_current._emailID;
    } else {
        nickname = 'Guest';
        email = 'Guest';
    };

    let playerRecord = leaderboards.find(p => p.email === email);
    if (!playerRecord) {
        playerRecord = {nickname: nickname, email: email, scores: []};
        leaderboards.push(playerRecord);
    };
    playerRecord.scores.push(player.score);
    localStorage.setItem('Leaderboards',JSON.stringify(leaderboards));

    if (user_current) {
        const score_index = users.findIndex(u => u.email === email);
        if (score_index !== -1) {
            if (player.score > users[score_index].high_score) {
                users[score_index].high_score = player.score;
            };
            localStorage.setItem('credentials',JSON.stringify(users));
        };
    };
};

function restartGame() {
    if (keys.has('r')) {
        location.reload();
        gameEnded = false;
        gameRunning = true;
    };
    requestAnimationFrame(restartGame);
};

// Variables for game entities;
const player = new Player(World.w/2 ,World.h/2 ,32 ,32, 250, '#ffffffff');
// When Spawning There is only 'gems' , 'enemy1', 'enemy2', 'enemy3'.
const spawngems = new GameManager('gems',250);
const spawnenemies = new GameManager('enemy',60);
const music = new BGAudioManager();

let last = performance.now();
function loop(now) {
    const dt = Math.min(1 / 30 ,(now-last)/1000);
    last = now;

    if (!gameRunning && !gameEnded) {
        paused();
        requestAnimationFrame(loop);
    }
    if (gameEnded) {
        GameOver();
        requestAnimationFrame(restartGame);
    };
    if (gameRunning && !gameEnded){
        player.move(dt);
        spawnenemies.followPlayer(dt,player);
        spawngems.update(player);
        spawnenemies.update(player);
        updateCamera();
        
        drawGrassMap();
        drawBgGrid();
        spawngems.draw();
        player.draw();
        spawnenemies.draw();

        requestAnimationFrame(loop);
    };
};

music.playRandTrack();
generateGrassMap();
requestAnimationFrame(loop);

healthDisp.textContent = "Health : " + player.health;
scoreDisp.textContent = "Score : " + player.score;