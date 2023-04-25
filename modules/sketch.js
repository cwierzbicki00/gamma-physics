const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let engine, world;
let ball,
  receptacle,
  platforms = [];
let leftWall, rightWall, ceiling, floor;
let ballImg, receptacleImg, platformImg, bgImg;

async function loadAndParseSVG(url) {
  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(text, "image/svg+xml");
}

function preload() {
  ballImg = loadImage("../../../assets/sprites/throwable/tennisball1x.png");
  receptacleImg = loadImage(
    "../../../assets/sprites/recepticles/trashcan/trashcan_collision.png"
  );
  receptacleSvg = loadAndParseSVG(
    "../../../assets/sprites/recepticles/trashcan/collider.svg"
  );

  platformImg = loadImage(
    "../../../assets/sprites/floor/floor-wood-full-1x.png"
  );
  bgImg = loadImage("../../../assets/bg/bg_area1.png");
}

function getPathDataFromSvgElement(svgElement) {
  const pathElement = svgElement.querySelector("path");
  const pathData = pathElement.getAttribute("d");
  return pathData;
}

function createBodiesFromSvg(pathData, x, y, scale) {
  const vertices = Matter.Svg.pathToVertices(pathData, 5);

  const scaledVertices = vertices.map((vertex) => {
    return Matter.Vector.mult(vertex, scale);
  });

  const options = {
    render: {
      fillStyle: color,
      strokeStyle: color,
    },
  };
  return Matter.Bodies.fromVertices(x, y, scaledVertices, options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;

  ball = new Ball(100, 300, 20, ballImg);

  platforms.push(new Platform(400, 400, 200, 20, platformImg));

  // Walls
  leftWall = new Boundary(0, height / 2, 10, height);
  rightWall = new Boundary(width, height / 2, 10, height);
  ceiling = new Boundary(width / 2, 0, width, 10);
  floor = new Boundary(width / 2, height, width, 10);

  const vertices = [
    [
      { x: -25, y: -40 },
      { x: 25, y: -40 },
      { x: 25, y: 40 },
      { x: -25, y: 40 },
    ],
  ];

  receptacle = new Receptacle(500, 80, receptacleImg, vertices);

  // Mouse Constraint
  const mouse = Mouse.create(canvas.elt);
// Add this to the MouseConstraint.create call
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
  collisionFilter: {
    group: -1, // To only interact with the ball
  },
});

Matter.World.add(world, mouseConstraint);


function draw() {
  Engine.update(engine);
  background(bgImg);

  ball.update();
  ball.show();
  receptacle.show();
  platforms.forEach((platform) => platform.show());

  leftWall.show();
  rightWall.show();
  ceiling.show();
  floor.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseReleased() {
  ball.mouseReleased();

  // Add angular velocity to the ball when the mouse is released
  const dx = ball.body.position.x - mouseX;
  const dy = ball.body.position.y - mouseY;
  const angle = Math.atan2(dy, dx);
  const angularVelocity = angle * 0.03;
  Matter.Body.setAngularVelocity(ball.body, angularVelocity);
}




class Ball {
  constructor(x, y, r, img) {
    const options = {
      restitution: 0.6, // Adjust the restitution value
      friction: 0.5, // Add friction
      frictionAir: 0.01, // Add frictionAir
      collisionFilter: {
        group: -1, // To only interact with the mouse constraint
      },
    };
    this.body = Bodies.circle(x, y, r, options);
    World.add(world, this.body);
    this.r = r;
    this.img = img;
  }

  // Add this method to the Ball class
  mouseReleased() {
    const speed = Matter.Vector.magnitude(this.body.velocity);
    if (speed < 0.01) {
      Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
    }
  }
  show() {
    const pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    imageMode(CENTER);
    image(this.img, 0, 0, this.r * 2, this.r * 2);
    pop();
  }

  update() {
    const pos = this.body.position;
    const vel = this.body.velocity;
    const r = this.r;

    if ((pos.x - r <= 0 && vel.x < 0) || (pos.x + r >= width && vel.x > 0)) {
      Matter.Body.setVelocity(this.body, { x: -vel.x, y: vel.y });
    }
    if ((pos.y - r <= 0 && vel.y < 0) || (pos.y + r >= height && vel.y > 0)) {
      Matter.Body.setVelocity(this.body, { x: vel.x, y: -vel.y });
    }

    const maxSpeed = 10;
    const speed = Matter.Vector.magnitude(this.body.velocity);
    if (speed > maxSpeed) {
      const scaleFactor = maxSpeed / speed;
      Matter.Body.setVelocity(this.body, {
        x: this.body.velocity.x * scaleFactor,
        y: this.body.velocity.y * scaleFactor,
      });
    }
  }
}

class Platform {
  constructor(x, y, w, h, img) {
    const options = {
      isStatic: true,
    };
    this.body = Bodies.rectangle(x, y, w, h, options);
    World.add(world, this.body);
    this.w = w;
    this.h = h;
    this.img = img;
  }

  show() {
    const pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h);
    pop();
  }
}

class Boundary {
  constructor(x, y, w, h) {
    const options = {
      isStatic: true,
    };
    this.body = Bodies.rectangle(x, y, w, h, options);
    World.add(world, this.body);
    this.w = w;
    this.h = h;
  }

  show() {
    const pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    rectMode(CENTER);
    fill(255);
    rect(0, 0, this.w, this.h);
    pop();
  }
}

class Receptacle {
  constructor(x, y, img, vertexSets) {
    const options = {
      isStatic: true,
    };
    this.body = Matter.Body.create(options);
    this.parts = [];

    for (let i = 0; i < vertexSets.length; i++) {
      const part = Matter.Bodies.fromVertices(x, y, vertexSets[i], options);
      this.parts.push(part);
    }

    Matter.Body.setParts(this.body, this.parts);
    World.add(world, this.body);
    this.img = img;
  }

  show() {
    push();
    imageMode(CENTER);
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    image(this.img, 0, 0);
    pop();
  }
}
