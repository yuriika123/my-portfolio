let canvasWidth;
let canvasHeight;
let scale;
let targetPos;

let balls = [];
let numBalls = 30;

function setup() {
  frameRate(60);
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  if (width > height) {
    scale = width/10;
  } else {
    scale = height/10;
  }

  targetPos = createVector(0, 0);
  balls = [];

  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball(scale));
  }
}

function draw() {
  background(16, 100);

  targetPos = createVector(mouseX, mouseY);

  for (let ball of balls) {
    ball.collide(balls);
    ball.update(targetPos);
    ball.display();
  }  
}

function windowResized() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
}

class Ball {
  constructor(scale) {
    this.circlePos = createVector(random(width), random(height));
    this.circleVel = createVector(0, 0);
    this.diameter = random(scale/2, scale);
    this.easing = random(0.02, 0.05);
    this.color = color(random(100, 255), random(100, 255), 200);
  }

  collide(others) {
    for (let other of others) {
      if (other == this) continue;
      let dx = other.circlePos.x - this.circlePos.x;
      let dy = other.circlePos.y - this.circlePos.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDistance = other.diameter / 2 + this.diameter / 2;

      if (distance < minDistance) {
        let angle = atan2(dy, dx)
        let targetX = this.circlePos.x + cos(angle) * minDistance;
        let targetY = this.circlePos.y + sin(angle) * minDistance;
        let ax = (targetX - other.circlePos.x) * 0.5;
        let ay = (targetY - other.circlePos.y) * 0.5;
        this.circlePos.x -= ax;
        this.circlePos.y -= ay;
        other.circlePos.x += ax;
        other.circlePos.y += ay;
      }
    }
  }

  update(targetPos) {
    let move = p5.Vector.sub(targetPos, this.circlePos);
    move.mult(this.easing);
    this.circleVel = move;
    this.circlePos.add(this.circleVel)

    if (this.circlePos.x <= this.diameter/2) {
      this.circlePos.x = this.diameter/2;
    } else if (this.circlePos.x >= width - this.diameter/2) {
      this.circlePos.x = width - this.diameter/2;
    }
    if (this.circlePos.y <= this.diameter/2) {
      this.circlePos.y = this.diameter/2;
    } else if (this.circlePos.y >= height - this.diameter/2) { 
      this.circlePos.y = height - this.diameter/2
    }
  }

  display() {
    fill(this.color);
    noStroke();
    circle(this.circlePos.x, this.circlePos.y, this.diameter);
  }
}


// キーボードの「r」を押すと録画開始／終了
function keyPressed() {
  if (key === 'r' || key === 'R') {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }
}