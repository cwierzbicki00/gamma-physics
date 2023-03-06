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
  // Set the alpha value of the canvas background to 0 for transparency
  background(0, 0, 0, 0);

  // Make the canvas transparent
  canvas.style("background-color", "transparent");

  gameBall = buildBall("basketball", gameBall);

  receptacle = buildReceptacle();

  // Add reset button to get ball back.
  //place at bottom left of canvas.
  let resetButton = createButton("Reset");
  resetButton.position(0, height - resetButton.height);

  // Add an event listener to the reset button
  resetButton.mousePressed(resetGame);

  function resetGame() {
    // Reset the ball if reset clicked
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
  //=> trigger event

  // stroke(255);
  // strokeWeight(4);
  // line(width, 150, width - 75, 150);
}

function buildBall(ballType, _gameBall) {
  // TODO:
  //  have ballType determined via menu?
  //  figure out size issue
  switch (ballType) {
    case "basketball":
      _gameBall = new throwable(150, height + 150, 0.784);
      _gameBall.img = loadImage("https://i.imgur.com/ToktDdG.png");

      break;
    case "bowlingball":
      _gameBall = new throwable(150, height + 150, 0.142);
      _gameBall.img = loadImage("https://i.imgur.com/cbOBDxF.png");
      break;
    case "golfball":
      _gameBall = new throwable(150, height + 150, 0.142);
      _gameBall.img = loadImage("https://i.imgur.com/wOLqk4C.png");
      break;
    case "tennisball":
      _gameBall = new throwable(150, height + 150, 0.142);
      _gameBall.img = loadImage("https://i.imgur.com/wSzErKC.png");
      break;
    default:
    //
  }
  return _gameBall;
}
function buildReceptacle() {
  let pos = createVector(windowWidth * 0.65, windowHeight * 0.65); // windowWidth/2 - extend.x,windowHeight/2
  let extend = createVector(200, 100);
  return new Receptacle(pos, extend);
}

// function setup() {
//   // createCanvas(400, 400);
//   // startButton = createButton("Start");
//   // startButton.position(width / 2 - startButton.width / 2, height / 2);
//   // startButton.mousePressed(startGame);
// }
