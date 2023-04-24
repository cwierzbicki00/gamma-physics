//     file name: menu.js
//       authors: Quoc, Ryan Smith, Nathan Fleet, Nick Weber
//  date created: 2 Mar 2023
// date modified: 19 Apr 2023 (quoc)

// description: Contains the driver code for the "Throw it in!" game.

// global variables for environment
// Import Matter.js modules
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
let engine;
let world;
let mConstraint;

let level = 1;
let environment;

// p5.js setup to start game on load - runs ONCE
function setup() {
  console.log("Game started");

  // -- set up the canvas ----------------------------------------------------

  //access the canvas container div in the html file
  let canvasContainer = document.getElementById("canvas-container");

  // set canvas AR
  let canvasAspectRatio = 1536 / 864;
  let newCanvasWidth = canvasContainer.offsetWidth;
  let newCanvasHeight = newCanvasWidth / canvasAspectRatio;

  if (newCanvasHeight > canvasContainer.offsetHeight) {
    newCanvasHeight = canvasContainer.offsetHeight;
    newCanvasWidth = newCanvasHeight * canvasAspectRatio;
  }

  let canvas = createCanvas(newCanvasWidth, newCanvasHeight);

  // set canvas to be responsive to window size
  canvas.parent(canvasContainer);
  background(0, 0, 0, 0);
  canvas.style("background-color", "transparent");
  console.log("Canvas created");

  frameRate(60);
  console.log("Frame rate set to 60 FPS");

  // -- build the environment ------------------------------------------------
  engine = Matter.Engine.create();
  world = engine.world;

  // Set up the mouse constraint for dragging the ball
  const canvasElement = document.getElementById("defaultCanvas0");

  const mouse = Mouse.create(canvas.elt);
  const mouseOptions = {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
    element: canvas.elt,
  };
  //set pixel density so it has context for canvas size & scale
  mouse.pixelRatio = pixelDensity();

  mConstraint = MouseConstraint.create(engine, mouseOptions);

  World.add(world, mConstraint);

  switch (level) {
    case 2:
      environment = new Environment(/*level2.json*/);
      console.log("Level 2 environment created");
      break;
    case 3:
      environment = new Environment(/*level3.json*/);
      console.log("Level 3 environment created");
      break;
    default: // level 1
      environment = new Environment(/*level1.json*/);
      console.log("Level 1 environment created");
      break;
  }
  // -- create and arrange buttons -------------------------------------------
  let resetButton = createButton("Reset");
  resetButton.mousePressed(resetGame);

  let golfballButton = createButton("Golfball");
  golfballButton.mousePressed(() => {
    environment.setThrowable("golfball");
  });

  let basketballButton = createButton("Basketball");
  basketballButton.mousePressed(() => {
    environment.setThrowable("basketball");
  });

  let bowlingballButton = createButton("Bowlingball");
  bowlingballButton.mousePressed(() => {
    environment.setThrowable("bowlingball");
  });

  let tennisballButton = createButton("Tennisball");
  tennisballButton.mousePressed(() => {
    environment.setThrowable("tennisball");
  });

  // rsmith - for turning off mouse barrier for debugging purposes
  let disableBarrier = createButton("DEBUG: Disable Barrier");
  disableBarrier.mousePressed(() => {
    environment.invertBarrierStatus();
  });

  // add styling to ball buttons
  resetButton.addClass("list buttonSize resetBtn");
  disableBarrier.addClass("list buttonSize barrierBtn");
  golfballButton.addClass("list buttonSize golfBtn");
  basketballButton.addClass("list buttonSize basketballBtn");
  tennisballButton.addClass("list buttonSize tennisBtn");
  bowlingballButton.addClass("list buttonSize bowlingBtn");
}

function draw() {
  clear(); // clears the entire canvas to be redrawn
  // TODO move this to the environment class when scoreboard is implemented
  drawScore(); // rsmith - draw score to screen
  // template for drawing objects

  environment.update();
  environment.receptacle.checkForEntry(environment.throwable);
  environment.display();
}

function resetGame() {
  environment.getThrowable().reset();
  environment.resetScore();
  console.log("Game reset");
}

// rsmith - draw score to top left of screen
function drawScore() {
  push(); // allows the following formatting to be temporary
  textSize(64);
  fill(0, 0, 0);
  text("Score: " + environment.getScore(), width * 0.1, height * 0.1);
  pop(); // ends the above formatting
}

//Reset mouse reference when window is resized
function updateMouseConstraint() {
  // Remove the old mouse constraint from the world
  World.remove(world, mConstraint);

  // Create a new mouse constraint with the updated canvas element
  const canvasElement = document.getElementById("canvas-container");
  const mouse = Mouse.create(canvasElement);
  const mouseOptions = {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
    element: canvasElement,

    offset: {
      x: canvasElement.getBoundingClientRect().left,
      y: canvasElement.getBoundingClientRect().top,
    },
  };

  mConstraint = MouseConstraint.create(engine, mouseOptions);

  // Add the new mouse constraint to the world
  World.add(world, mConstraint);
}

//Resize canvas when window is resized
async function windowResized() {
  let canvasContainer = document.getElementById("canvas-container");
  let canvasAspectRatio = 1536 / 864;
  let newCanvasWidth = canvasContainer.offsetWidth;
  let newCanvasHeight = canvasContainer.offsetHeight;

  let containerAspectRatio = newCanvasWidth / newCanvasHeight;
  if (containerAspectRatio > canvasAspectRatio) {
    newCanvasWidth = newCanvasHeight * canvasAspectRatio;
  } else {
    newCanvasHeight = newCanvasWidth / canvasAspectRatio;
  }

  resizeCanvas(newCanvasWidth, newCanvasHeight);

  environment.updateScaleFactors();

  await environment.destroy(); //nukes the old environment except state

  //rebuild the environment
  environment = new Environment(environment);

  updateMouseConstraint();
}
