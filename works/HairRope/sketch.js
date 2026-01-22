let scale;
let ropes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateScale();

  let ropeNum = 100;
  for (let i = 0; i < ropeNum; i++) {
    ropes.push(new Rope())
    ropes[i].setup(scale,random(width / (ropeNum + 1) * (i + 1) - 10, width / (ropeNum + 1) * (i + 1) + 10));
  }
}

function draw() {
  background(220);

  for(let rope of ropes) {
    rope.update();
    rope.draw();
  }
}

class Point {
  constructor(x, y, locked) {
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
    this.locked = locked;
  }

  update() {
    if (this.locked) return;

    let vx = this.x - this.oldX;
    let vy = this.y - this.oldY;

    this.oldX = this.x;
    this.oldY = this.y;

    this.x += vx * 0.99;
    this.y += vy * 0.99;
    let gravity = 0.5;
    this.y += gravity;
  }
}

class Rope {
  constructor() {
    this.points = [];
    this.segmentLength;
  }

  setup(scale, x) {
    this.segmentLength = scale/5;

    let numPoints = 40;
    for (let i = 0; i < numPoints; i++) {
      if (i == 0) {
        this.points.push(new Point(x + i, i * this.segmentLength, true));
      } else {
        this.points.push(new Point(x + i, i * this.segmentLength, false));
      }
    }
  }

  update() {
    for (let point of this.points) {
      point.update();
    }

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < this.points.length - 1; j++) {
        let p1 = this.points[j];
        let p2 = this.points[j + 1];

        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let distance = sqrt(dx * dx + dy * dy);
        let error = distance - this.segmentLength;
        let percent = error / distance / 2;
        let offsetX = dx * percent;
        let offsetY = dy * percent;

        if (!p1.locked) {
          p1.x += offsetX;
          p1.y += offsetY;
        }
        if (!p2.locked) {
          p2.x -= offsetX;
          p2.y -= offsetY;
        }
      }
    }

    for (let point of this.points) {
      let distance = dist(mouseX, mouseY, point.x, point.y);
      if (distance < 30) {
        point.x += (mouseX - pmouseX) * 0.5;
        point.y += (mouseY - pmouseY) * 0.5
      }
    }
  }

  draw() {
    noFill();
    strokeWeight(2);
    beginShape();
    for (let point of this.points) {
      vertex(point.x, point.y);
    }
    endShape();
  }
}

function updateScale() {
  if (width > height) {
    scale = width/10;
  } else {
    scale = height/10;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateScale();
}