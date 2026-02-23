let ball = new Ball();

for (let i = 0; i < 376; i++) {
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
  moveBall(ball);
}
