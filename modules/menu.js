// authors: Nathan Fleet, Ryan Smith, Nick Weber

// p5js setup to start game on load - runs ONCE
function setup() {
    startGame();
}

// global vars for game ball and receptacle
let gameBall;
let receptacle;

function startGame() {
    console.log("game started");

    // canvas setup ------------------------------------------------------------
    let canvasContainer = document.getElementById("canvas-container");
    let canvas = createCanvas(
        canvasContainer.offsetWidth,
        canvasContainer.offsetHeight
    );

    canvas.parent(canvasContainer);
    background(0, 0, 0, 0);
    canvas.style("background-color", "transparent");
    // -------------------------------------------------------------------------

    //build ball and receptacle
    gameBall = buildBall("tennisball", gameBall);
    receptacle = buildReceptacle();

    // create and arrange buttons ----------------------------------------------
    let resetButton = createButton("Reset");
    resetButton.mousePressed(resetGame);

    let golfballButton = createButton("Golfball");
    golfballButton.mousePressed(() => {
        gameBall = buildBall("golfball", gameBall);
    });

    let basketballButton = createButton("Basketball");
    basketballButton.mousePressed(() => {
        gameBall = buildBall("basketball", gameBall);
    });

    let bowlingballButton = createButton("Bowlingball");
    bowlingballButton.mousePressed(() => {
        gameBall = buildBall("bowlingball", gameBall);
    });

    let tennisballButton = createButton("Tennisball");
    tennisballButton.mousePressed(() => {
        gameBall = buildBall("tennisball", gameBall);
    });

    // rsmith - for turning off mouse barrier for debugging purposes
    let disableBarrier = createButton("DEBUG: Disable Barrier");
    disableBarrier.mousePressed(() => {
        gameBall.mouseBarrierActive = !gameBall.mouseBarrierActive;
    });

    /* condensing */
    resetButton.addClass("list buttonSize resetBtn");
    disableBarrier.addClass("list buttonSize barrierBtn");
    golfballButton.addClass("list buttonSize golfBtn");
    basketballButton.addClass("list buttonSize basketballBtn");
    tennisballButton.addClass("list buttonSize tennisBtn");
    bowlingballButton.addClass("list buttonSize bowlingBtn");

    // -------------------------------------------------------------------------
}

function resetGame() {
    gameBall.reset();
    receptacle.setScore(0); // rsmith
}

function mousePressed() {
    gameBall.pressed(mouseX, mouseY);
}

function mouseReleased() {
    gameBall.released();
}

function draw() {
    clear(); // clears the entire canvas to be redrawn

    drawScore(); // rsmith - draw score to screen

    let gravity = createVector(0, 0.2);
    let weight = p5.Vector.mult(gravity, gameBall.mass);
    gameBall.applyForce(weight);

    gameBall.over(mouseX, mouseY);
    gameBall.mouseOutOfBounds(); // rsmith
    gameBall.update();
    gameBall.edges();
    gameBall.show();
    receptacle.show();
    receptacle.OnCollisionEnter(gameBall); // rsmith

}

function buildBall(ballType, _gameBall) {
    switch (ballType) {
        case "basketball":
            _gameBall = new throwable(150, height + 150, 0.784);
            // scaled sprites via image editor and reupload
            _gameBall.img = loadImage("https://i.imgur.com/d5B8YI0.png");
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
    let pos = createVector(width / 2, height / 2);
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

// rsmith - draw score to top left of screen
function drawScore() {
    push(); // allows the following formatting to be temporary
    textSize(64);
    textAlign(CENTER, CENTER);
    fill(0, 0, 0);
    text("Score: " + receptacle.getScore(), width * 0.1, height * 0.1);
    pop(); // ends the above formatting
}
