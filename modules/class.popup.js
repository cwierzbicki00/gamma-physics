//     file name: class.popup.js
//       authors: Nathan Fleet
//  date created: 20 Apr 2023
// date modified:

// description: Class for popup which should appear when:
//                  - Timer runs out
//                  - Target score is reached

// this could likely be implemented in update() Environment class
class Popup {
  constructor(x, y, width, height, message) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.message = message;
    this.visible = true;
  }

  display() {
    if (this.visible) {
      push();
      rectMode(CENTER);
      fill(255, 255, 255);
      rect(this.x, this.y, this.width, this.height);
      textSize(32);
      fill(0, 0, 0);
      textAlign(CENTER, CENTER);
      text(this.message, this.x, this.y);
      //Add a next level button if message  = "Level Finished"
      //Add a restart button if message = "Game Over"
      //Add a quit button if message = "Game Over" or "Level Finished"
      if (this.message == "Level Finished") {
        this.nextLevelButton = createButton("Next Level");
        this.nextLevelButton.position(this.x, this.y + 50);
        this.nextLevelButton.mousePressed(() => {
          level = level + 1;
          nextLevel = true;
          delete this.nextLevelButton;
        });
      } else if (this.message == "Game Over") {
        //Add a restart button if message = "Game Over"
        this.restartButton = createButton("Restart");
        this.restartButton.position(this.x, this.y + 50);
        this.restartButton.mousePressed(() => {
          level = 1;
          this.restartButton.hide();
          this.hide();
        });
      }
      pop();
    }
  }

  hide() {
    this.visible = false;
  }
}
