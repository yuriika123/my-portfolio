let scale;
let pgRed, pgBlue;
let balls = [];
let numBalls = 25;

class Ball {
  constructor(scale) {
    this.d = random(scale/1.5, scale*2);
    this.x = random(this.d, width - this.d);
    this.y = random(this.d, height - this.d);

    this.col = color(255);

    this.vx = 0;
    this.vy = 0;
    this.xOff = random(1000);
    this.yOff = random(1000);
  }

  update() {
    this.ax = map(noise(this.xOff), 0, 1, -0.5, 0.5);
    this.ay = map(noise(this.yOff), 0, 1, -0.5, 0.5);
    this.xOff += 0.01;
    this.yOff += 0.01;

    this.vx += this.ax;
    this.vy += this.ay;
    this.vx = constrain(this.vx, -5, 5);
    this.vy = constrain(this.vy, -5, 5);
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= this.d/2 || this.x + this.d/2 >= width) {
      this.vx *= -1.2;
    }
    if (this.y <= this.d/2 || this.y + this.d/2 >= height) {
      this.vy *= -1.2;
    }
  }

  display(target, colorOverride) {
    target.noStroke();
    target.fill(colorOverride);
    target.circle(this.x, this.y, this.d)
  }
}





let canvasWidth;
let canvasHeight;

function setup() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);
  if (width > height) {
    scale = width/10;
  } else {
    scale = height/10;
  }
  pgRed = createGraphics(canvasWidth, canvasHeight);
  pgBlue = createGraphics(canvasWidth, canvasHeight);

  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball(scale));
  }
}

function draw() {
  for (let ball of balls) {
    ball.update();
  }

  background(209, 214, 217);

  for (let i = 0; i < balls.length; i++) {
    let ballColor = (i % 2 == 0) ? '#E60012' : '#0068B6';
    balls[i].display(this, ballColor);
  }

  // 重なりの処理
  pgRed.clear();
  pgBlue.clear();
  pgRed.noStroke();
  pgBlue.noStroke();
  // 偶数番目のボールを描く
  pgRed.fill(255);
  for (let i = 0; i < balls.length; i += 2) {
    balls[i].display(pgRed, 255);
  }
  // 奇数番目のボールを描く
  pgBlue.fill(255);
  for (let i = 1; i < balls.length; i += 2) {
    balls[i].display(pgBlue, 255);
  }
  // すでに描画されている部分と重なるところだけ残す
  pgRed.drawingContext.globalCompositeOperation = 'source-in';
  pgRed.image(pgBlue, 0, 0);
  // 重なった部分に色をつける
  pgRed.fill(254);
  pgRed.rect(0, 0, width, height)
  pgRed.drawingContext.globalCompositeOperation = 'source-over';
  image(pgRed, 0, 0)
}

function windowResized() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  if (width > height) {
    scale = width/10;
  } else {
    scale = height/10;
  }
  pgRed = createGraphics(windowWidth, windowHeight);
  pgBlue = createGraphics(windowWidth, windowHeight);
}