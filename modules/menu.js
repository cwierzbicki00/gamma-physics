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

const Vector = Matter.Vector;
const Composite = Matter.Composite;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
let engine;
let world;
let mConstraint;

let level = 2;
let environment;

let canvas;

//Fullscreen via javascript API
function toggleFullscreen() {
  let canvasContainer = document.getElementById("canvas-container");

  if (!document.fullscreenElement) {
    canvasContainer.requestFullscreen().catch((err) => {
      alert(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
  } else {
    document.exitFullscreen();
  }
}

// Add an event listener to the full screen button
let fullscreenButton = document.getElementById("fullscreen-btn");
fullscreenButton.addEventListener("click", toggleFullscreen);

//Preload the level, images, and set up the world.
function preload() {
  //Start engine and define world
  engine = Engine.create();
  world = engine.world;

  // Load the level
  // Create the environment, by selecting the level
  createLevelEnvironment(level);
}

// p5.js setup to start game on load - runs ONCE
function setup() {
  console.log("Game started");

  // -- set up the canvas-----------------------------------------------------

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

  canvas = createCanvas(newCanvasWidth, newCanvasHeight);

  // set canvas to be responsive to window size
  canvas.parent(canvasContainer);
  background(0, 0, 0, 0);
  canvas.style("background-color", "transparent");
  console.log("Canvas created");

  frameRate(60);
  console.log("Frame rate set to 60 FPS");

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
}

function createLevelEnvironment(level) {
  switch (level) {
    case 2:
      fetch("../../../assets/jsons/level1-2.json")
        .then((response) => response.json())
        .then((data) => {
          //if environment already exists, take score, timer, mouseBarrierActive
          //and add to data
          if (environment) {
            data.score = environment.score;
            data.timer = environment.timer;
            data.mouseBarrierActive = environment.mouseBarrierActive;
          }

          environment = new Environment(data);
        });
      console.log("Level 2 environment created");
      break;
    case 3:
      fetch("../../../assets/jsons/level1-3.json")
        .then((response) => response.json())
        .then((data) => {
          //if environment already exists, take score, timer, mouseBarrierActive
          //and add to data
          if (environment) {
            data.score = environment.score;
            data.timer = environment.timer;
            data.mouseBarrierActive = environment.mouseBarrierActive;
          }

          environment = new Environment(data);
        });
      console.log("Level 3 environment created");
      break;
    default: // level 1
      fetch("../../../assets/jsons/level1-1.json")
        .then((response) => response.json())
        .then((data) => {
          //if environment already exists, take score, timer, mouseBarrierActive
          //and add to data
          if (environment) {
            data.score = environment.score;
            data.timer = environment.timer;
            data.mouseBarrierActive = environment.mouseBarrierActive;
          }

          environment = new Environment(data);
        });
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
  background(0, 0, 0, 0); // sets the background to be transparent

  // template for drawing objects

  if (environment && environment.receptacle) {
    environment.update();
    environment.receptacle.checkForEntry(environment.throwable);
    environment.display();
  }
}

function resetGame() {
  environment.getThrowable().reset();
  //environment.resetScore();
  console.log("Game reset");
}

//Reset mouse reference when window is resized
function updateMouseConstraint() {
  // Remove the old mouse constraint from the world
  World.remove(world, mConstraint);

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

  await environment.destroy(); //nukes the old environment except state

  resizeCanvas(newCanvasWidth, newCanvasHeight);

  environment.updateScaleFactors();

  //rebuild the environment
  createLevelEnvironment(level);

  updateMouseConstraint();
}
