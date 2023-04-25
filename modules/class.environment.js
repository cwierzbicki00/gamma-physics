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
  }

  initializeDefaultGameObjects(data) {
    this.score = 0;
    this.timer = null;
    this.mouseBarrierActive = true;
  }

  initializeCommonGameObjects(data) {
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

    this.backgroundImage = null; //loadImage(data.backgroundImage);
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

  update() {
    if (this.throwable) {
      this.throwable.update(this);
    }

    Matter.Engine.update(engine);
  }

  display() {
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
