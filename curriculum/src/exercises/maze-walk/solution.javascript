function walk(steps) {
  repeat(steps) {
    move();
  }
}

walk(3);
turnLeft();
walk(2);
turnRight();
walk(4);
