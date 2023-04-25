// Filename: class.environment.js
// Authors: Quoc, Ryan Smith
// Date created: 13 Apr 2023
// Date modified: 13 Apr 2023 (rsmith)

// Description: Contains a base class for an environment object, which is
// intended to hold information related to the current level.

class Environment {
  constructor(data) {
    this.updateScaleFactors();
    this.initializeEnvironment(data);
    console.log("canvas width: " + width + ", canvas height: " + height);

    this.particles = [];
    this.scoreTexts = [];
  }

  initializeEnvironment(data) {
    if (data.score != null) {
      this.retainOngoingGameObjects(data);
    } else {
      this.initializeDefaultGameObjects(data);
    }
    console.log("data: " + data);

    // Scale positions, width, and height of the platforms and receptacles
    data.platforms.forEach((platformData) => {
      platformData.position.x =
        eval(platformData.position.x) * this.scaleFactorX;
      console.log("platformData.position.x: " + platformData.position.x);
      platformData.position.y =
        eval(platformData.position.y) * this.scaleFactorY;
      console.log("platformData.position.y: " + platformData.position.y);
      platformData.width = eval(platformData.width);
      platformData.height = eval(platformData.height);
    });

    data.receptacle.x = eval(data.receptacle.x) * this.scaleFactorX;
    data.receptacle.y = eval(data.receptacle.y) * this.scaleFactorY;

    this.initializeCommonGameObjects(data);
  }

  //Necessary for scaling the environment when the window is resized
  retainOngoingGameObjects(previousEnvironment) {
    this.score = previousEnvironment.score;
    this.timer = previousEnvironment.timer;
    this.mouseBarrierActive = previousEnvironment.mouseBarrierActive;
    this.timerActive = previousEnvironment.timerActive;
    this.startButtonClicked = previousEnvironment.startButtonClicked;
  }

  initializeDefaultGameObjects(data) {
    this.score = 0;
    this.timer = null;
    this.mouseBarrierActive = true;
    this.timerActive = false;
    this.startButtonClicked = false;
  }

  initializeCommonGameObjects(data) {
    //load images
    this.overlayImageFg = loadImage(data.overlayImageFg);
    this.overlayImageBg = loadImage(data.overlayImageBg);
    this.receptacleFg = loadImage(data.receptacle.fg);
    this.receptacleBg = loadImage(data.receptacle.bg);
    this.receptacleCollision = loadImage(data.receptacle.collision);

    //for flash on score:

    this.receptacleBgOpacity = 255;

    //scoreboard
    this.scoreboard = new Scoreboard(this);

    // game objects
    this.addBoundaries();
    this.receptacle = new Receptacle(
      data.receptacle.type,
      this.scaleFactorX,
      this.scaleFactorY
    );
    this.throwable = new Throwable(
      data.throwable.type,
      this.scaleFactorX,
      this.scaleFactorY
    );
    this.platforms = data.platforms.map(
      (platformData) =>
        new Platform(
          {
            x: eval(platformData.position.x),
            y: eval(platformData.position.y),
          },
          eval(platformData.width) * this.scaleFactorX,
          eval(platformData.height) * this.scaleFactorY,
          eval(platformData.angle)
        )
    );

    //receptacle properties for display
    this.receptacleImgX = data.receptacle.x;
    this.receptacleImgY = data.receptacle.y;

    //this.platforms.push( new Platform({ x: width/4, y: height }, width/2, 100, 40));
    //this.platforms.push( new Platform({ x: 400, y: height/2 }, 200, 100, 0));

    // TODO awaiting implementation of scoreboard class
    // this.scoreboard = new scoreboard();

    // progression variables
    this.pointsRequired = data.pointsRequired;
    this.timeAllowed = data.timeAllowed; // seconds

    // environmental physics
    this.gravity = createVector(data.gravity.x, data.gravity.y); // earth gravity: 9.8 m/s^2
    this.wind = createVector(data.wind.x, data.wind.y); // wind force: 0 m/s^2

    this.backgroundImage = loadImage(data.backgroundImage);
  }

  //utility score celebrations
  flashReceptacleBackground() {
    this.receptacleBgOpacity = 100;
  }

  generateConfetti() {
    for (let i = 0; i < 30; i++) {
      // number of particles
      this.particles.push(
        new Particle(this.receptacleImgX, this.receptacleImgY)
      );
    }
  }

  displayScoreTexts() {
    for (let i = this.scoreTexts.length - 1; i >= 0; i--) {
      this.scoreTexts[i].update();
      this.scoreTexts[i].display();

      if (this.scoreTexts[i].isDone()) {
        this.scoreTexts.splice(i, 1);
      }
    }
  }

  // accessors
  getThrowable() {
    return this.throwable;
  }
  getReceptacle() {
    return this.receptacle;
  }
  getPlatform(index) {
    return this.platforms[index];
  }
  getGravity() {
    return this.gravity;
  }
  getWind() {
    return this.wind;
  }
  getScore() {
    return this.score;
  }
  getBarrierStatus() {
    return this.mouseBarrierActive;
  }

  // modifiers
  setThrowable(newType) {
    this.throwable.destroy();
    this.throwable = new Throwable(
      newType,
      this.scaleFactorX,
      this.scaleFactorY
    );
  }
  setReceptacle(newType) {
    this.receptacle = new Receptacle(
      newType,
      this.scaleFactorX,
      this.scaleFactorY
    );
  }
  setGravity(newGravity) {
    this.gravity = createVector(0, newGravity * -1);
  }
  setWind(newWindX, newWindY) {
    this.wind = createVector(newWindX, newWindY);
  }
  addScore(newScore) {
    this.score += newScore;
    this.flashReceptacleBackground();
    this.generateConfetti();
    this.scoreTexts.push(
      new ScoreText(this.receptacleImgX, this.receptacleImgY - 50, newScore)
    );
    console.log("score: " + this.score);
  }
  resetScore() {
    this.score = 0;
  }
  resetTimer(seconds) {
    this.timer = seconds;
  }
  invertBarrierStatus() {
    this.mouseBarrierActive = !this.mouseBarrierActive;
  }

  //Popup timer
  levelTimer() {
    if (this.timerActive) {
      this.timeAllowed -= deltaTime / 1000;
      if (this.timeAllowed <= 0 || this.score >= this.pointsRequired) {
        this.timeAllowed = 0;
        this.timerActive = false;
        let canvasContainer = document.getElementById("canvas-container");
        this.popup = new Popup(
          width / 2,
          height / 2,
          canvasContainer.offsetWidth / 4,
          canvasContainer.offsetHeight / 2,
          //Set message as Game Over if time runs out, or set message as Level Finished if score reached
          this.score >= this.pointsRequired ? "Level Finished" : "Game Over"
        );
        console.log("Game Over");
        // this.startButtonClicked = false;
      }
    }
  }
  update() {
    if (this.throwable) {
      this.throwable.update(this);
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isOffScreen()) {
        this.particles.splice(i, 1);
      }
    }

    //Level timer
    this.levelTimer();

    Matter.Engine.update(engine);
  }

  display() {
    //Display background image
    if (this.backgroundImage) {
      let bgWidth = width;
      let bgHeight = height;
      imageMode(CORNER);
      image(this.backgroundImage, 0, 0, bgWidth, bgHeight);
    }

    if (this.overlayImageBg) {
      imageMode(CENTER);
      let imageWidth = this.overlayImageBg.width * 4 * this.scaleFactorX;
      let imageHeight = this.overlayImageBg.height * 4 * this.scaleFactorY;
      image(
        this.overlayImageBg,
        width / 2,
        height - imageHeight / 2,
        imageWidth,
        imageHeight
      );
    }

    //Display receptacles
    if (this.receptacleBg) {
      imageMode(CENTER);
      let imageWidth = this.receptacleBg.width * 4 * this.scaleFactorX;
      let imageHeight = this.receptacleBg.height * 4 * this.scaleFactorY;
      tint(255, this.receptacleBgOpacity); // Apply the opacity
      image(
        this.receptacleBg,
        this.receptacleImgX,
        this.receptacleImgY,
        imageWidth,
        imageHeight
      );

      tint(255, 255); // Reset the tint
    }

    // Display particles
    for (const particle of this.particles) {
      particle.display();
    }

    //Display score texts
    this.displayScoreTexts();

    if (this.receptacleCollision) {
      imageMode(CENTER);
      let imageWidth = this.receptacleCollision.width * 4 * this.scaleFactorX;
      let imageHeight = this.receptacleCollision.height * 4 * this.scaleFactorY;

      image(
        this.receptacleCollision,
        this.receptacleImgX,
        this.receptacleImgY,
        imageWidth,
        imageHeight
      );
    }

    if (this.throwable) {
      this.throwable.display();
    }
    if (this.receptacle) {
      this.receptacle.display();
    }
    if (this.platforms) {
      this.platforms.forEach((platform) => platform.display(this));
    }
    //scoreboard.display();

    // Display the overlay image
    if (this.overlayImageFg) {
      imageMode(CENTER);
      let imageWidth = this.overlayImageFg.width * 4 * this.scaleFactorX;
      let imageHeight = this.overlayImageFg.height * 4 * this.scaleFactorY;
      image(
        this.overlayImageFg,
        width / 2,
        height - imageHeight / 2,
        imageWidth,
        imageHeight
      );
    }
    //display front of receptacle
    if (this.receptacleFg) {
      imageMode(CENTER);
      let imageWidth = this.receptacleFg.width * 4 * this.scaleFactorX;
      let imageHeight = this.receptacleFg.height * 4 * this.scaleFactorY;

      image(
        this.receptacleFg,
        this.receptacleImgX,
        this.receptacleImgY,
        imageWidth,
        imageHeight
      );
    }

    //display score
    this.scoreboard.display();

    //Display popup above all other elements
    if (this.popup) {
      this.popup.display();
    }
  }

  addBoundaries() {
    // create the ground
    const edgeOptions = {
      isStatic: true,
      label: "edges",
    };
    let ground = Bodies.rectangle(width / 2, height, width, 5, edgeOptions);
    let leftWall = Bodies.rectangle(0, height / 2, 5, height, edgeOptions);
    let rightWall = Bodies.rectangle(width, height / 2, 5, height, edgeOptions);
    let ceiling = Bodies.rectangle(width / 2, 0, width, 5, edgeOptions);
    World.add(world, [ground, leftWall, rightWall, ceiling]);
  }

  //for maintaining position and scale of objects for the aspect ratio.
  updateScaleFactors() {
    this.scaleFactorX = width / 1536;
    this.scaleFactorY = height / 864;
  }

  destroy() {
    return new Promise((resolve) => {
      // Destroy throwable if it exists
      if (this.throwable) {
        this.throwable.destroy();
        this.throwable = null;
      }

      // Destroy receptacle if it exists
      if (this.receptacle) {
        this.receptacle.destroy();
        this.receptacle = null;
      }

      // Destroy platforms if they exist
      if (this.platforms) {
        this.platforms.forEach((platform) => platform.destroy());
        this.platforms = null;
      }

      //nuke the whole world >:)
      World.clear(world, false);

      //notify destruction
      console.log("Environment destroyed");

      // Resolve the promise after completing the destroy process
      resolve();
    });
  }
}

//Scoreboard class for displaying score, time, and goal score.
class Scoreboard {
  constructor(environment) {
    this.environment = environment;
  }

  createStartButton() {
    if (!this.startButton && !this.environment.startButtonClicked) {
      this.startButton = createButton("Start");
      //give button ID of start-button
      this.startButton.id("start-button");

      this.startButton.parent("canvas-container");
      this.startButton.mousePressed(() => {
        this.environment.timerActive = true;
        this.startButton.hide();
        this.environment.startButtonClicked = true;
      });

      // Style the start button make it green
      this.startButton.style("background-color", "#4CAF50");
      this.startButton.style("color", "white");
      this.startButton.style("border-radius", "5px");
      this.startButton.style("border", "none");
      this.startButton.style("font-size", "18px");
      //make it bold
      this.startButton.style("font-weight", "bold");
      this.startButton.style("padding", "8px 16px");
      //center it
      this.startButton.style("display", "flex");
      this.startButton.style("margin", "auto");
      this.startButton.style("justify-content", "center");
      this.startButton.style("align-items", "center");
      this.startButton.style("position", "absolute");
      this.startButton.style("top", "0");
      this.startButton.style("bottom", "0");
      this.startButton.style("left", "0");
      this.startButton.style("right", "0");
      this.startButton.style("width", "100px");
      this.startButton.style("height", "50px");
      this.startButton.style("z-index", "1");

      if (this.startButton) {
        const verticalCenter = 0;
        const horizontalCenter = 0;
        this.startButton.position(horizontalCenter, verticalCenter);
      }
    }
  }

  display() {
    const score = this.environment.getScore();
    const goal = this.environment.pointsRequired;
    const timeRemaining = Math.round(this.environment.timeAllowed);
    if (
      !this.environment.timerActive &&
      !this.environment.startButtonClicked &&
      !this.startButton
    ) {
      //clear all other start buttons (have id start-button)
      const startButtons = document.querySelectorAll("#start-button");

      startButtons.forEach((button) => button.remove());
      this.createStartButton();
    } else if (this.startButton && this.environment.startButtonClicked) {
      this.startButton.remove();
      this.startButton = null;
      this.environment.resetScore();
      this.environment.resetTimer(this.environment.timeAllowed);
    }
    push();
    textAlign(CENTER, CENTER);

    // Background container
    fill(0, 0, 0, 200);
    rect(0, 0, width, 50);

    // Score text
    textSize(24);
    fill(255);
    text(`Score: ${score} / ${goal}`, width / 4, 25);

    // Time remaining text
    text(`Time remaining: ${timeRemaining}s`, (width / 4) * 3, 25);

    pop();
  }
}

//Particles for celebrations woohoo

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-4, -1));
    this.acc = createVector(0, 0.05);
    this.size = random(4, 10);
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  isOffScreen() {
    return this.pos.y > height;
  }
}

//Fun score texts that appear when you score
class ScoreText {
  constructor(x, y, points) {
    this.x = x;
    this.y = y;
    this.points = points;
    this.alpha = 255;
    this.velocityY = -2;
  }

  update() {
    this.y += this.velocityY;
    this.alpha -= 1;
  }

  display() {
    fill(0, 255, 0, this.alpha);
    textSize(46);
    textAlign(CENTER, CENTER);
    text(`+${this.points}`, this.x, this.y);
  }

  isDone() {
    return this.alpha <= 0;
  }
}
