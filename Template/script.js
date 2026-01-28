//Isac Cavander Avoid box game 

//game settings 
const PLAYER_SPEED = 8;
const BOX_SPEED = 20;
const SIZE = 70;
const DASH_DISTANCE = 60;

// state contains all the moving parts 
let state = {
playerX: 300,
playerY: window.innerHeight - 90,
boxX: 200,
boxY: 0,
score: 0,
isRunning: true,
keyLeft: false,
keyRight: false,
keySpace: false,
shieldActive: false,
shieldTime: 0,
shieldUsed: false
};

// settings object contains all fixed parts
const settings = {
playerElement: document.getElementById('player'),
boxElement: document.getElementById('box'),
scoreElement: document.getElementById('score'),
messageElement: document.getElementById('message'),
shieldTimerElement: document.getElementById('shieldTimer'),
starContainerElement: document.getElementById('starContainer')
};

// dash left when Q is tapped
function dashLeft() {
state.playerX -= DASH_DISTANCE;

if (state.playerX < 0) {
state.playerX = 0;
}

settings.playerElement.style.left = state.playerX + 'px';
}

// dash right when P is tapped
function dashRight() {
state.playerX += DASH_DISTANCE;

if (state.playerX > window.innerWidth - SIZE) {
 state.playerX = window.innerWidth - SIZE;
}

settings.playerElement.style.left = state.playerX + 'px';
}

//check for shield activation
function checkShield() {
if (state.keyLeft && state.keyRight && state.keySpace && !state.shieldUsed) {
state.shieldActive = true;
state.shieldTime = 180;
state.shieldUsed = true;
}
}

//makes the box fall down 
function moveBox() {
state.boxY += BOX_SPEED;

let currentBoxSize = SIZE + (state.score * 5);

let sizeDifference = currentBoxSize - SIZE;
let centeredX = state.boxX - (sizeDifference / 2);

settings.boxElement.style.left = centeredX + 'px';
settings.boxElement.style.top = state.boxY + 'px';
settings.boxElement.style.width = currentBoxSize + 'px';
settings.boxElement.style.height = currentBoxSize + 'px';

if (state.boxY > window.innerHeight) {
state.score++;
spawnNewBox();
settings.scoreElement.textContent = 'score: ' + state.score;
}

if (isColliding()) {
if (state.shieldActive) {
spawnNewBox();
state.score++;
settings.scoreElement.textContent = 'score: ' + state.score;
} else {
endGame();
}
}
}

//Repositions box at top
function spawnNewBox() {
state.boxX = Math.random() * (window.innerWidth - SIZE);
state.boxY = 0;
}

//Check if box hits circle 
function isColliding() {
let pLeft = state.playerX;
let pRight = state.playerX + SIZE;
let pTop = state.playerY;
let pBottom = state.playerY + SIZE;

let currentBoxSize = SIZE + (state.score * 5);
let sizeDifference = currentBoxSize - SIZE;
let centeredX = state.boxX - (sizeDifference / 2);

let bLeft = centeredX;
let bRight = centeredX + currentBoxSize;
let bTop = state.boxY;
let bBottom = state.boxY + currentBoxSize;

if (pRight > bLeft && pLeft < bRight && pBottom > bTop && pTop < bBottom) {
return true;
}
return false;
}

//game over
function endGame() {
state.isRunning = false;
let msg = settings.messageElement;
msg.textContent = 'Game over score: ' + state.score;
msg.style.color = '#fc1900ff';
msg.style.fontSize = '28px';
}

//restart game 
function restartGame() {
state.score = 0;
state.isRunning = true;
state.playerX = 300;
state.boxY = 0;
state.shieldActive = false;
state.shieldTime = 0;
state.shieldUsed = false;
settings.scoreElement.textContent = 'score: 0';
settings.messageElement.textContent = 'Use q to dodge left and use p to dodge right';
settings.shieldTimerElement.textContent = '';
}

// create background stars 
function createStars() {
let starsHTML = '';

for (let i = 0; i < 50; i++) {
let x = Math.random() * window.innerWidth;
let y = Math.random() * window.innerHeight;
let starSize = Math.random() * 3 + 1;

starsHTML += '<div class="star" style="left: ' + x + 'px; top: ' + y + 'px; width: ' + starSize + 'px; height: ' + starSize + 'px;"></div>';
}

settings.starContainerElement.innerHTML = starsHTML;
}

//key press handlers 
function keyDown(event) {
if (event.key === 'q') {
state.keyLeft = true;
if (state.isRunning) {
dashLeft();
}
}
if (event.key === 'p') {
state.keyRight = true;
if (state.isRunning) {
dashRight();}
}
if (event.key === 'r' && !state.isRunning) {
restartGame();
}
if (event.key === ' ') {
 event.preventDefault();
state.keySpace = true;
}
}

function keyUp(event) {
if (event.key === 'q') {
state.keyLeft = false;
}
if (event.key === 'p') {
state.keyRight = false;
}
if (event.key === ' ') {
state.keySpace = false;
}
}

// update function 
function update() {
if (state.isRunning) {
checkShield();
moveBox();

if (state.shieldActive && state.shieldTime > 0) {
for (let i = 0; i < 1; i++) {
state.shieldTime = state.shieldTime - 1;

if (state.shieldTime <= 0) {
state.shieldActive = false;
state.shieldTime = 0;
}
}
}
}

window.requestAnimationFrame(update);
}

// use function outputs data to screen
function use() {
if (state.shieldActive) {
settings.playerElement.style.backgroundColor = 'gold';
} else {
settings.playerElement.style.backgroundColor = 'deeppink';
}
if (state.shieldActive) {
let seconds = Math.ceil(state.shieldTime / 60);
settings.shieldTimerElement.textContent = 'shield: ' + seconds + 's';
} else {
settings.shieldTimerElement.textContent = '';
}

window.requestAnimationFrame(use);
}
// setup function runs once at start
function setup() {
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
createStars();
spawnNewBox();
state.score = 0;
update();
use();
}

setup();