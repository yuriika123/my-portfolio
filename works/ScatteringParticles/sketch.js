let scale;

class Particle {
  constructor(x, y) {
    this.pos = createVector(random(width), random(height)); // 現在の場所
    this.target = createVector(x, y); // 目指す場所
    this.vel = createVector(0, 0);
    this.acc = createVector(0,0);
    this.r = 1; // 点の大きさ
    this.maxSpeed = 5;
    this.maxForce = 1;
  }

  behaviors() {
    let mouse = createVector(mouseX, mouseY);
    // マウスから逃げる力
    let flee = this.flee(mouse);
    flee.mult(5);
    // 本来の場所に戻る力
    let arrive = this.arrive(this.target);
    arrive.mult(1);

    this.applyForce(flee);
    this.applyForce(arrive);
  }

  applyForce(force) {
    this.acc.add(force)
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  display() {
    stroke(200);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos); // 目的地へのベクトル
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 200) {
      speed = map(d, 0,  200, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  flee(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d < 100) {
      desired.setMag(this.maxSpeed);
      desired.mult(-1);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0,0);
    }
  }
}



let myFont;
let points = [];
let particles = [];

function preload() {
  myFont = loadFont('NotoSansJP-Thin.ttf')
}

let canvasWidth;
let canvasHeight;

function setup() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);
  if (width > height) {
    scale = width/10;
  } else {
    scale = height/10;
  }
  frameRate(60);

  let text = 'PARTICLE'
  let fontSize = scale;
  let stepX = scale * 4.23;
  let stepY = scale * 0.69

  for (let y = fontSize; y < height + fontSize; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      let localPoints = myFont.textToPoints(text, x, y, fontSize, {
        sampleFactor: 0.2,
        simplifyThreshold: 0
      });
      for (let pt of localPoints) {
        particles.push(new Particle(pt.x + random(-4, 4), pt.y + random(-4, 4)));
      }
    }
  }
}

function draw() {
  background(16);
  for (let particle of particles) {
    particle.behaviors();
    particle.update();
    particle.display();
  }
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
  particles = [];
  setup();
}