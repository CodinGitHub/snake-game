const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

//Cambio de fuente
let myFont = new FontFace(
  "GamerFont",
  "url(https://fonts.gstatic.com/s/pressstart2p/v14/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2)"
);

myFont.load().then((font) => {
  document.fonts.add(font);
  console.log("Font loaded");
});

let lightGreen = '#BCC900';
let green = '#756D00';
let darkGreen = '#554f03';
let veryDarkGreen = '#343106';

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 140;

let tileCount = 8;
let tileSize = 8;

let headX = 15;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 8;
let appleY = 8;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gulpSound = new Audio("gulp.mp3");

//game loop
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();
  
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawBorders();
  drawScore();

  if (score > 5) {
    speed = 110;
  }
  if (score > 10) {
    speed = 80;
  }
  setTimeout(drawGame, speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  //walls
  if (headX < 4) {
    gameOver = true;
  } else if (headX === 29) {
    gameOver = true;
  } else if (headY < 3) {
    gameOver = true;
  } else if (headY === 18) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = veryDarkGreen;
    ctx.font = "19px GamerFont";

    if (gameOver) {
      ctx.fillStyle = "white";
      ctx.font = "19px GamerFont";
      ctx.fillStyle = veryDarkGreen;

      ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
  }

  return gameOver;
}

function drawBorders(){
    ctx.fillStyle = green;
    ctx.beginPath();
    ctx.moveTo(32,24);
    ctx.lineTo(232,24);
    ctx.lineTo(232,144);
    ctx.lineTo(32,144);
    ctx.lineTo(32,24);
    ctx.stroke();
    ctx.closePath();
}

function drawScore() {
  ctx.fillStyle = green;
  ctx.font = "10px GamerFont";
  ctx.fillText("Score " + score, canvas.width - 100, 18);
}

function clearScreen() {
  ctx.fillStyle = lightGreen;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = green;
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // remove the furthet item from the snake parts if have more than our tail size.
  }

  ctx.fillStyle = darkGreen;
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = veryDarkGreen;
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * 29);
    if(appleX < 4)
        appleX = 4;
    if(appleX> 29)
        appleX = 29;
    appleY = Math.floor(Math.random() * 18);
    if(appleY < 3)
        appleY = 3;
    if(appleY> 18)
        appleY = 18;
    tailLength++;
    score++;
    gulpSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //Enter
  if (event.keyCode == 13){
    location.reload();
  }
  //up
  if (event.keyCode == 38 || event.keyCode == 87) {
    //87 is w
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    // 83 is s
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    // 65 is a
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    //68 is d
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

drawGame();