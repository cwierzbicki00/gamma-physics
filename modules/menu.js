//     file name: menu.js
//       authors: Quoc, Ryan Smith, Nathan Fleet, Nick Weber
//  date created: 2 Mar 2023
// date modified: 13 Apr 2023 (rsmith)

// description: Contains the driver code for the "Throw it in!" game.

// global variables for environment
let level = 1;
let environment;

// p5.js setup to start game on load - runs ONCE
function setup() {
    console.log("Game started");

    // -- set up the canvas ----------------------------------------------------

    let canvasContainer = document.getElementById("canvas-container");
    let canvas = createCanvas(
        canvasContainer.offsetWidth,
        canvasContainer.offsetHeight
    );
    canvas.parent(canvasContainer);
    background(0, 0, 0, 0);
    canvas.style("background-color", "transparent");
    console.log("Canvas created");

    frameRate(60);
    console.log('Frame rate set to 60 FPS');

    // -- build the environment ------------------------------------------------

    switch(level){
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
        environment.setThrowable('golfball');
    });

    let basketballButton = createButton("Basketball");
    basketballButton.mousePressed(() => {
        environment.setThrowable('basketball');
    });

    let bowlingballButton = createButton("Bowlingball");
    bowlingballButton.mousePressed(() => {
        environment.setThrowable('bowlingball');
    });

    let tennisballButton = createButton("Tennisball");
    tennisballButton.mousePressed(() => {
        environment.setThrowable('tennisball');
    });

    // rsmith - for turning off mouse barrier for debugging purposes
    let disableBarrier = createButton("DEBUG: Disable Barrier");
    disableBarrier.mousePressed(() => {
        environment.invertBarrierStatus();
    });

    // add styling to ball buttons
    resetButton.addClass("list");
    disableBarrier.addClass("list");
    golfballButton.addClass("list");
    basketballButton.addClass("list");
    tennisballButton.addClass("list");
    bowlingballButton.addClass("list");

    // button positioning classes
    resetButton.addClass("resetBtn");
    disableBarrier.addClass("barrierBtn");
    golfballButton.addClass("golfBtn");
    basketballButton.addClass("basketballBtn");
    tennisballButton.addClass("tennisBtn");
    bowlingballButton.addClass("bowlingBtn");

}

function draw() {
    clear(); // clears the entire canvas to be redrawn

    // TODO move this to the environment class when scoreboard is implemented
    drawScore(); // rsmith - draw score to screen

    // template for drawing objects
    environment.update();
    environment.display();
}

function resetGame() {
    environment.getThrowable().reset();
    environment.resetScore();
    console.log('Game reset');
}

function mousePressed() {
    environment.getThrowable().mousePressed(environment);
}

function mouseReleased() {
    if (environment.getThrowable().getDragging()) {
        environment.getThrowable().mouseReleased();
    }
}

// rsmith - draw score to top left of screen
function drawScore() {
    push(); // allows the following formatting to be temporary
    textSize(64);
    fill(0, 0, 0);
    text("Score: " + environment.getScore(), width * 0.1, height * 0.1);
    pop(); // ends the above formatting
}
