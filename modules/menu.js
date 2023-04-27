// menu.js
// authors: Quoc, Ryan Smith, Nathan Fleet, Nick Weber
// date created: 2 Mar 2023
// date modified: 19 Apr 2023 (quoc)
// description: Contains the driver code for the "Throw it in!" game.

// Import Matter.js modules
const { Engine, World, Bodies, Vector, Composite, Mouse, MouseConstraint } =
  Matter;

// Global variables
let engine,
  world,
  mConstraint,
  level = 1,
  environment,
  nextLevel = false,
  restart = false,
  timeRemainingStat, //for popup
  throwables,
  canvas;

// Fullscreen via javascript API
function toggleFullscreen() {
  const canvasContainer = document.getElementById("canvas-container");
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
document
  .getElementById("fullscreen-btn")
  .addEventListener("click", toggleFullscreen);

// Preload the level, images, and set up the world.
function preload() {
  engine = Engine.create();
  world = engine.world;
  createLevelEnvironment(level);
}

// p5.js setup to start game on load - runs ONCE
function setup() {
  if (edit) startTest();
  console.log("Game started");
  setupCanvas();
  setupMouseConstraint();
  frameRate(60);
  console.log("Frame rate set to 60 FPS");
}

function setupCanvas() {
  const canvasContainer = document.getElementById("canvas-container");
  const canvasAspectRatio = 1536 / 864;
  let newCanvasWidth = canvasContainer.offsetWidth;
  let newCanvasHeight = newCanvasWidth / canvasAspectRatio;

  if (newCanvasHeight > canvasContainer.offsetHeight) {
    newCanvasHeight = canvasContainer.offsetHeight;
    newCanvasWidth = newCanvasHeight * canvasAspectRatio;
  }

  canvas = createCanvas(newCanvasWidth, newCanvasHeight);
  canvas.parent(canvasContainer);
  background(0, 0, 0, 0);
  canvas.style("background-color", "transparent");
  console.log("Canvas created");
}

function setupMouseConstraint() {
  const mouse = Mouse.create(canvas.elt);
  const mouseOptions = {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
    element: canvas.elt,
  };
  mouse.pixelRatio = pixelDensity();
  mConstraint = MouseConstraint.create(engine, mouseOptions);
  World.add(world, mConstraint);
}

function createLevelEnvironment(level) {
  const levelJSONPaths = [
    "../../../assets/jsons/level1-1.json",
    "../../../assets/jsons/level1-2.json",
    "../../../assets/jsons/level1-3.json",
  ];
  const levelIndex = level > levelJSONPaths.length ? 0 : level - 1;

  fetch(levelJSONPaths[levelIndex])
    .then((response) => response.json())
    .then((data) => {
      if (environment) setRetainingData(data);
      environment = new Environment(data);
    });

  console.log(`Level ${level} environment created`);

  //Generalize retaining data
  function setRetainingData(data) {
    data.score = environment.score;
    data.timerActive = environment.timerActive;
    data.mouseBarrierActive = environment.mouseBarrierActive;
    if (restart) {
      data.startButtonClicked = false;
    } else {
      data.startButtonClicked = environment.startButtonClicked;
    }
    environment.timeAllowed == 0
      ? (data.timeAllowed = data.timeAllowed)
      : (data.timeAllowed = environment.timeAllowed);
    data.edit = edit;
  }
}

//REFACTOR FROM HERE:

// -- create and arrange buttons -------------------------------------------
function createButton(text, className, onClick) {
  const button = document.createElement("button");
  button.innerText = text;
  button.classList.add("list", "buttonSize", className);
  button.addEventListener("click", onClick);
  document.body.appendChild(button);
  return button;
}

createButton("Reset", "resetBtn", resetGame);
createButton("Golfball", "golfBtn", () => environment.setThrowable("golfball"));
createButton("Basketball", "basketballBtn", () =>
  environment.setThrowable("basketball")
);
createButton("Bowlingball", "bowlingBtn", () =>
  environment.setThrowable("bowlingball")
);
createButton("Tennisball", "tennisBtn", () =>
  environment.setThrowable("tennisball")
);

// rsmith - for turning off mouse barrier for debugging purposes
createButton("DEBUG: Disable Barrier", "barrierBtn", () =>
  environment.invertBarrierStatus()
);

function draw() {
  clear(); // clears the entire canvas to be redrawn
  background(0, 0, 0, 0); // sets the background to be transparent

  // template for drawing objects

  if (environment && environment.receptacle) {
    environment.update();
    environment.receptacle.checkForEntry(environment.throwable);
    environment.display();
  }

  if (nextLevel) {
    //Reset all values
    environment.destroy(); //nukes the old environment except state
    environment.resetScore();
    environment.nextLevel();
    createLevelEnvironment(level);
    //reset mouse constraint
    updateMouseConstraint();

    nextLevel = false;
  }

  if (restart) {
    //Reset all values
    environment.destroy(); //nukes the old environment except state
    environment.resetScore();
    environment.startButtonClicked = false;
    createLevelEnvironment(level);
    //Start
    //reset mouse constraint
    updateMouseConstraint();
    restart = false;
  }

  testing();
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

//Physic EDITOR
let vertices;
let edit = false;
let index;
let radius = 10;
let dragged = false;
let buttonX = 0; // X coordinate of the button
let buttonY = 0; // Y coordinate of the button
let buttonWidth = 100; // Width of the button
let buttonHeight = 50; // Height of the button

let buttonX0 = 20; // X coordinate of the button
let buttonY0 = 60; // Y coordinate of the button
let buttonWidth0 = 100; // Width of the button
let buttonHeight0 = 50; // Height of the button
function mousePressed() {
  if (edit) {
    let check = false;
    if (
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight
    ) {
      endTestSection(); // call the buttonClicked() function if the mouse is clicked inside the button area
      check = true;
    }
    if (
      mouseX >= buttonX0 &&
      mouseX <= buttonX0 + buttonWidth0 &&
      mouseY >= buttonY0 &&
      mouseY <= buttonY0 + buttonHeight0
    ) {
      resetTest(); // call the buttonClicked() function if the mouse is clicked inside the button area
      check = true;
    }

    if (!check) {
      if (vertices.length == 0) {
        vertices = [];
        vertices.push({ x: mouseX, y: mouseY });
      } else {
        let check = true;
        for (let i = 0; i < vertices.length; i++) {
          let v = vertices[i];
          let p = { x: mouseX, y: mouseY };
          let distance = Matter.Vector.magnitude(Matter.Vector.sub(v, p));
          if (distance < radius) {
            console.log("DRAGGINGGG");
            dragged = true;
            index = i;
            check = false;
            break;
          }
        }
        if (check) {
          dragged = false;
          vertices.push({ x: mouseX, y: mouseY });
        }
      }
    }
  }
}
function mouseDragged() {
  if (edit && dragged) {
    vertices[index].x = mouseX;
    vertices[index].y = mouseY;
  }
}
function resetTest() {
  vertices = [];
}
function startTest() {
  vertices = [];
  index = 0;
}

function testing() {
  if (edit) {
    for (const v of vertices) {
      stroke(0); // set the stroke color to black
      fill(0); // set the fill color to black
      ellipse(v.x, v.y, radius, radius);
    }
    for (let i = 0; i < vertices.length - 1; i++) {
      stroke(0); // set the stroke color to black
      fill(0); // set the fill color to black
      line(vertices[i].x, vertices[i].y, vertices[i + 1].x, vertices[i + 1].y);
    }

    rect(buttonX, buttonY, buttonWidth, buttonHeight); // draw the button
    fill(255, 0, 0, 255); // set the fill color to black
    textSize(20); // set the text size to 20
    text("clickhere", buttonX + 10, buttonY + 30); // draw the text on top of the button

    rect(buttonX0, buttonY0, buttonWidth0, buttonHeight0); // draw the button
    fill(255, 0, 0, 255); // set the fill color to black
    textSize(15); // set the text size to 20
    text("RESET Test", buttonX0 + 10, buttonY0 + 30); // draw the text on top of the button
  }
}
function endTestSection() {
  edit = false;
  let s = "[";
  for (const v of vertices) {
    s +=
      "{ x:" +
      Math.round(v.x / environment.scaleFactorX) +
      "*scaleFactorX ," +
      "y:" +
      Math.round(v.y / environment.scaleFactorY) +
      "*scaleFactorY},";
  }
  s += "];";
  console.log(s);
}
