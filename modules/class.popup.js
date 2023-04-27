class Popup {
  constructor(x, y, width, height, message) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.message = message;
    this.visible = true;
    this.buttons = [];

    // Variables for text animation
    this.textSizeFactor = 0;
    this.textSizeDirection = 1;
  }

  display() {
    if (this.visible) {
      push();
      imageMode(CENTER);
      rectMode(CENTER);
      //Draw background (white)
      fill(255);
      rect(this.x, this.y, this.width, this.height);

      // Animated text size
      textSize((32 + this.textSizeFactor) * environment.scaleFactorY);
      this.animateTextSize();

      //Black text
      fill(0);
      textAlign(CENTER, CENTER);
      text(this.message, this.x, this.y + this.height / 12);

      //Header text "Throw It In!"
      fill(0);
      textSize(48 * environment.scaleFactorY);
      text("Throw It In!", this.x, this.y - this.height / 2.5);

      //Subheader text "Level x"
      fill(0);
      textSize(32 * environment.scaleFactorY);
      text("Level " + level, this.x, this.y - this.height / 4);

      //Subheader stats (time remaining for now)
      fill(0);
      textSize(32 * environment.scaleFactorY);
      text(
        "Time remaining: " +
          (Math.floor(timeRemainingStat) == -1
            ? 0
            : Math.floor(timeRemainingStat)) +
          " seconds",
        this.x,
        this.y - this.height / 10
      );

      // Button Y position
      const buttonY = this.y + this.height / 3;

      // Add a next level button if message = "Level Complete!"
      if (this.message == "Level Complete!" && this.nextLevelButton == null) {
        if (level === 3) {
          this.message = "Game Complete! Nice work :)";
        } else {
          this.createNextLevelButton(buttonY);
        }
      } else if (this.message == "Game Over :(" && this.restartButton == null) {
        // Add a restart button if message = "Game Over"
        this.createRestartButton(buttonY);
      }

      //Add a border around the popup
      noFill();
      stroke(0);
      strokeWeight(4 * environment.scaleFactorY);
      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height);

      pop();
    }
  }

  // Function to animate the text size
  animateTextSize() {
    this.textSizeFactor += 0.2 * this.textSizeDirection;

    if (this.textSizeFactor >= 5) {
      this.textSizeDirection = -1;
    } else if (this.textSizeFactor <= 0) {
      this.textSizeDirection = 1;
    }
  }

  createNextLevelButton(buttonY) {
    this.nextLevelButton = createButton("Next Level");
    this.nextLevelButton.position(width / 2, buttonY);
    this.styleButton(this.nextLevelButton);
    this.nextLevelButton.mousePressed(() => {
      level = level + 1;
      nextLevel = true;
      this.hideButtons();
    });
    this.buttons.push(this.nextLevelButton);
  }

  createRestartButton(buttonY) {
    this.restartButton = createButton("Restart");
    this.restartButton.position(width / 2, buttonY);
    this.styleButton(this.restartButton);
    this.restartButton.mousePressed(() => {
      level = 1;
      restart = true;
      this.hideButtons();
      this.hide();
    });
    this.buttons.push(this.restartButton);
  }

  styleButton(button) {
    button.style("background-color", "#4CAF50");
    button.style("color", "white");
    button.style("border-radius", "5px");
    button.style("border", "none");
    button.style("font-size", `${22 * environment.scaleFactorY}px`);
    button.style("font-weight", "bold");
    button.style("padding", "12px 20px");
    button.style("cursor", "pointer");
    button.style("box-shadow", "0 4px 8px 0 rgba(0,0,0,0.2)");
    button.style("transform", "scale(1.1) translate(-50%, -5px)");
    // Set parent to container
    button.parent("canvas-container");
    // Center the button horizontally
    button.style("position", "absolute");
    button.style("left", "50%");
  }

  hide() {
    this.visible = false;
  }

  hideButtons() {
    for (let button of this.buttons) {
      button.hide();
    }
  }
}
