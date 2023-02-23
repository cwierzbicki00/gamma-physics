//     file name: menu.js
//        authors: Nathan Fleet
//  date created: 20 Feb 2023
// date modified: 20 Feb 2023

// description: basic menu with functioning start button

let hideElement = (docObj, index, className) =>
  docObj[index].classList.add(className);

function startGame() {
  // game code here
  console.log("game started");
  //hide title screen elements
  hideElement(startButton, 0, "hidden");
  hideElement(startTitle, 0, "hidden");
}

//when button clicked start game
let startButton = document.getElementsByClassName("btn-start");
let startTitle = document.getElementsByClassName("main-title");

startButton[0].addEventListener("click", startGame);

// function setup() {
//   // createCanvas(400, 400);
//   // startButton = createButton("Start");
//   // startButton.position(width / 2 - startButton.width / 2, height / 2);
//   // startButton.mousePressed(startGame);
// }

function draw() {
  // background(150);
  // textAlign(CENTER);
  // textSize(36);
  // text("Gamma Game", width / 2, height / 3);
}
