//     file name: menu.js
//        authors: Nathan Fleet
//  date created: 20 Feb 2023
// date modified: 20 Feb 2023

// description: basic menu with functioning start button
let startButton;

function setup() {
  createCanvas(400, 400);
  startButton = createButton("Start");
  startButton.position(width / 2 - startButton.width / 2, height / 2);
  startButton.mousePressed(startGame);
}

function draw() {
  background(150);
  textAlign(CENTER);
  textSize(36);
  text("Gamma Game", width / 2, height / 3);
}

function startGame() {
    // game code here
}