//     file name: menu.js
//        authors: Nathan Fleet, Ryan Smith
//  date created: 20 Feb 2023
// date modified: 27 Feb 2023

// description: basic menu with functioning start button

//when button clicked start game
//let startButton = document.getElementsByClassName("btn-start");

//startButton[0].addEventListener("click", startGame);

//p5js setup to start game on load

function setup() {
  startGame();
  // Set the alpha value of the canvas background to 0 for transparency
}

//global var for game ball
let gameBall;
let receptacle;
function startGame() {
  console.log("game started");
  let canvasContainer = document.getElementById("canvas-container");
  let canvas = createCanvas(
    canvasContainer.offsetWidth,
    canvasContainer.offsetHeight
  );
  canvas.parent(canvasContainer);
  background(0, 0, 0, 0);
  canvas.style("background-color", "transparent");

  gameBall = buildBall("tennisball", gameBall);

  receptacle = buildReceptacle();

  let resetButton = createButton("Reset");
  // resetButton.position(0, height - resetButton.height);
  resetButton.mousePressed(resetGame);

  let golfballButton = createButton("Golfball");
  // golfballButton.position(0, height - resetButton.height * 4);
  golfballButton.mousePressed(() => {
    gameBall = buildBall("golfball", gameBall);
  });

  let basketballButton = createButton("Basketball");
  // basketballButton.position(0, height - resetButton.height * 6);
  basketballButton.mousePressed(() => {
    gameBall = buildBall("basketball", gameBall);
  });

  let bowlingballButton = createButton("Bowlingball");
  // bowlingballButton.position(0, height - resetButton.height * 8);
  bowlingballButton.mousePressed(() => {
    gameBall = buildBall("bowlingball", gameBall);
  });

  let tennisballButton = createButton("Tennisball");
  // tennisballButton.position(0, height - resetButton.height * 10);
  tennisballButton.mousePressed(() => {
    gameBall = buildBall("tennisball", gameBall);
  });

  //add styling to ball buttons
  resetButton.addClass("list");
  golfballButton.addClass("list");
  basketballButton.addClass("list");
  tennisballButton.addClass("list");
  bowlingballButton.addClass("list");
  resetButton.addClass("resetBtn");
  golfballButton.addClass("golfBtn");
  basketballButton.addClass("basketballBtn");
  tennisballButton.addClass("tennisBtn");
  bowlingballButton.addClass("bowlingBtn");

  function resetGame() {
    gameBall.reset();
  }
}

function mousePressed() {
  gameBall.pressed(mouseX, mouseY);
}

function mouseReleased() {
  gameBall.released();
}

function draw() {
  // background(150);
  // textAlign(CENTER);
  // textSize(36);
  // text("Gamma Game", width / 2, height / 3);
  //background(0);

  clear();

  // Check if the ball has bounced 10 times (buggy, so disabled)
  //   if (gameBall.bounceCount >= 15) {
  //     gameBall.reset(); // Reset the ball
  //   }

  let gravity = createVector(0, 0.2);
  let weight = p5.Vector.mult(gravity, gameBall.mass);
  gameBall.applyForce(weight);

  gameBall.over(mouseX, mouseY);
  gameBall.update();
  gameBall.edges();
  gameBall.show();
  receptacle.show();

  //if score = true => scored
  let score = receptacle.update(gameBall);
  console.log(score);
  //=> trigger event

  // stroke(255);
  // strokeWeight(4);
  // line(width, 150, width - 75, 150);
}

function buildBall(ballType, _gameBall) {
  // TODO:
  //  have ballType determined via menu?
  switch (ballType) {
    case "basketball":
      _gameBall = new throwable(150, height + 150, 0.784);

      // _gameBall.img = loadImage("https://i.imgur.com/ToktDdG.png"); original
      _gameBall.img = loadImage("https://i.imgur.com/d5B8YI0.png"); // scaled sprites via image editor and reupload
      // radius = width of scaled sprite / 2 (pixels)
      _gameBall.setRad(74);
      _gameBall.setType("basketball");

      break;
    case "bowlingball":
      _gameBall = new throwable(150, height + 150, 0.142);
      // _gameBall.img = loadImage("https://i.imgur.com/cbOBDxF.png"); original
      _gameBall.img = loadImage("https://i.imgur.com/NTqjnK4.png");
      _gameBall.setRad(72);
      _gameBall.setType("bowlingball");
      break;
    case "golfball":
      _gameBall = new throwable(150, height + 150, 0.142);
      // _gameBall.img = loadImage("https://i.imgur.com/wOLqk4C.png"); original
      _gameBall.img = loadImage("https://i.imgur.com/cXYIMIm.png");
      _gameBall.setRad(18);
      _gameBall.setType("golfball");
      break;
    case "tennisball":
      _gameBall = new throwable(150, height + 150, 0.142);
      // _gameBall.img = loadImage("https://i.imgur.com/wSzErKC.png"); original
      _gameBall.img = loadImage("https://i.imgur.com/ZL0oho5.png");
      _gameBall.setRad(26);
      _gameBall.setType("tennisball");
      break;
    default:
      console.log("Invalid ball.");
  }
  return _gameBall;
}
function buildReceptacle() {
  let pos = createVector(width / 2, height / 2); // windowWidth/2 - extend.x,windowHeight/2
  let vertices = [
    createVector(width / 2 - 50, height / 2 - 100),
    createVector(width / 2 + 50, height / 2 - 100),
    createVector(width / 2 + 100, height / 2),
    createVector(width / 2 + 50, height / 2 + 100),
    createVector(width / 2 - 50, height / 2 + 100),
    createVector(width / 2 - 100, height / 2),
  ];
  return new Receptacle(pos, vertices);
}

// function setup() {
//   // createCanvas(400, 400);
//   // startButton = createButton("Start");
//   // startButton.position(width / 2 - startButton.width / 2, height / 2);
//   // startButton.mousePressed(startGame);
// }
