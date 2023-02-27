//     file name: menu.js
//        authors: Nathan Fleet, Ryan Smith
//  date created: 20 Feb 2023
// date modified: 27 Feb 2023

// description: basic menu with functioning start button


//when button clicked start game
let startButton = document.getElementsByClassName("btn-start");

startButton[0].addEventListener("click", startGame);

function startGame() {
  // game code here
  console.log("game started");
  createCanvas(windowWidth, windowHeight);
  let gameBall; // create an empty object to store the game ball in
  buildBall(1, gameBall); // TODO replace parameter with appropriate menu selection
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
    background(0);

    let gravity = createVector(0, 0.2);
    let weight = p5.Vector.mult(gravity, gameBall.mass);
    gameBall.applyForce(weight);

    gameBall.over(mouseX, mouseY);
    gameBall.update();
    gameBall.edges();
    gameBall.show();

    stroke(255);
    strokeWeight(4);
    line(width,150,width-75,150);
}

function buildBall(ballType, _gameBall) {
    switch (ballType) {
        case 1: // baseball
            _gameBall = new throwable(150, height + 150, 0.142);
            break;

    }
}

// function setup() {
//   // createCanvas(400, 400);
//   // startButton = createButton("Start");
//   // startButton.position(width / 2 - startButton.width / 2, height / 2);
//   // startButton.mousePressed(startGame);
// }
