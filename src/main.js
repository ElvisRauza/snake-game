// Get canvas from dom
const canvas = document.getElementById("snake-game");
const gamePopup = document.querySelector(".game-popup");
const gameMessage = document.querySelector(".game-message");
const gameScore = document.querySelector(".game-score");

canvas.width = 600;
canvas.height = 600;

// Get context
const ctx = canvas.getContext("2d");

// Global variables
const cellSize = 20;
const fps = 5;

let gameId = null;
let snake = [];
let apple = false;
let issuedMove = false;
let direction = {};
let score = 0;

// Functions
const initGame = () => {
  gamePopup.classList.add("hidden");
  gameMessage.classList.add("hidden");

  score = 0;

  snake = [
    {
      x: cellSize * 5,
      y: cellSize * 5,
    },
  ];

  direction = {
    x: 0,
    y: 1,
  };

  issuedMove = false;
};

/**
 * Draws rect on canva
 */
const drawRect = (width, height, x, y, color, border = false) => {
  let mainX = x;
  let mainY = y;

  let mainWidth = width;
  let mainHeight = height;

  if (border) {
    ctx.fillStyle = "#526dd1";
    ctx.fillRect(x, y, width, height);

    mainX = x + 2;
    mainY = y + 2;

    mainWidth = width - 4;
    mainHeight = height - 4;
  }

  ctx.fillStyle = color;
  ctx.fillRect(mainX, mainY, mainWidth, mainHeight);
};

/**
 * Radom number in range
 */
const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

// Draw background
drawRect(canvas.width, canvas.height, 0, 0, "black");

// Draws snake
const drawSnake = (snake) => {
  snake.forEach((coord) => {
    drawRect(cellSize, cellSize, coord.x, coord.y, "white", true);
  });
};

// Draws apple
const drawApple = (x, y) => {
  drawRect(cellSize, cellSize, x, y, "red");
};

const generateApple = () => {
  let apple = {};
  apple.x = cellSize * randomNumber(0, (canvas.width - cellSize) / cellSize);
  apple.y = cellSize * randomNumber(0, (canvas.height - cellSize) / cellSize);

  let filter = snake.filter((snakePart) => {
    return snakePart.x === apple.x && snakePart.y === apple.y;
  });

  if (filter.length) {
    apple = generateApple();
  }

  return apple;
};

//
const moveSnake = () => {
  issuedMove = false;
  let head = {
    x: snake[0].x + direction.x * cellSize,
    y: snake[0].y + direction.y * cellSize,
  };
  snake.unshift(head);

  if (hasEatenApple()) {
    score += 1;
    apple = false;
  } else {
    snake.pop();
  }
};

const drawScore = () => {
  gameScore.innerHTML = score;
};

const hasEatenApple = () => {
  return snake[0].x === apple.x && snake[0].y === apple.y;
};

// reDraw
const reDraw = () => {
  drawRect(canvas.width, canvas.height, 0, 0, "black");

  drawSnake(snake);
  if (!apple) {
    apple = generateApple(snake);
  }
  drawApple(apple.x, apple.y);

  drawScore();
};

// Check if game ended
const hasGameEnded = () => {
  const head = snake[0];

  // Self eat.
  let selfEat = snake.filter((snakePart) => {
    return head.x === snakePart.x && head.y === snakePart.y;
  });
  if (selfEat.length > 1) {
    return true;
  }

  // Wall collisions.
  const hitTopWall = head.y < 0;
  const hitBottomWall = head.y > canvas.height;
  const hitLeftWall = head.x < 0;
  const hitRightWall = head.x > canvas.width;
  if (hitTopWall || hitRightWall || hitLeftWall || hitBottomWall) {
    return true;
  }

  return false;
};

const notifyGameEnded = () => {
  gameMessage.classList.remove("hidden");
};

// Game loop
const gameLoop = () => {
  if (hasGameEnded()) {
    stopGame();
  }

  moveSnake();
  reDraw();
};

const stopGame = () => {
  gamePopup.classList.remove("hidden");
  notifyGameEnded();
  clearInterval(gameId);
  gameId = null;
};

const changeSnakeDirection = (event) => {
  if (issuedMove) {
    return;
  }

  if ("ArrowUp" === event.key && 1 !== direction.y) {
    direction.x = 0;
    direction.y = -1;

    issuedMove = true;
  }

  if ("ArrowDown" === event.key && -1 !== direction.y) {
    direction.x = 0;
    direction.y = 1;

    issuedMove = true;
  }

  if ("ArrowLeft" === event.key && 1 !== direction.x) {
    direction.x = -1;
    direction.y = 0;

    issuedMove = true;
  }

  if ("ArrowRight" === event.key && -1 !== direction.x) {
    direction.x = 1;
    direction.y = 0;

    issuedMove = true;
  }
};

document.addEventListener("keydown", changeSnakeDirection);

const startEl = document.getElementById("start");
startEl.addEventListener("click", () => {
  stopGame();
  initGame();

  if (!gameId) {
    gameId = setInterval(gameLoop, 1000 / fps);
  }
});
