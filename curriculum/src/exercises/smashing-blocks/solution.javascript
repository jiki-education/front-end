let ball = new Ball();

let blocks = [];
let y = 31;
for (let x = 1; x <= 5; x++) {
  blocks.push(new Block(8 + ((x - 1) * 17), y));
}

function changeDirection() {
  if (ball.cx - ball.radius <= 0) {
    ball.xVelocity = 1;
  }
  if (ball.cx + ball.radius >= 100) {
    ball.xVelocity = -1;
  }
  if (ball.cy - ball.radius <= 0) {
    ball.yVelocity = 1;
  }
  if (ball.cy + ball.radius >= 100) {
    ball.yVelocity = -1;
  }
}

function handleCollision() {
  let ballTop = ball.cy - ball.radius;
  let ballBottom = ball.cy + ball.radius;
  let ballLeft = ball.cx - ball.radius;
  let ballRight = ball.cx + ball.radius;

  for (const block of blocks) {
    if (block.smashed) {
      continue;
    }
    if (!ballHorizontallyAlignedToBlock(block, ball.cx)) {
      continue;
    }
    if (ballTop === block.top + block.height) {
      ball.yVelocity = 1;
      block.smashed = true;
      return;
    }
    if (ballBottom === block.top) {
      ball.yVelocity = -1;
      block.smashed = true;
      return;
    }
  }
}

function ballHorizontallyAlignedToBlock(block, ballCx) {
  return ballCx >= block.left && ballCx <= block.left + block.width;
}

function allBlocksSmashed() {
  for (const block of blocks) {
    if (!block.smashed) {
      return false;
    }
  }
  return true;
}

for (let i = 0; i < 5000; i++) {
  moveBall(ball);
  changeDirection();
  handleCollision();
  if (allBlocksSmashed()) {
    break;
  }
}
