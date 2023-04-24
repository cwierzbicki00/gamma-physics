// Filename: class.environment.js
// Authors: Quoc, Ryan Smith
// Date created: 13 Apr 2023
// Date modified: 13 Apr 2023 (rsmith)

// Description: Contains a base class for an environment object, which is
// intended to hold information related to the current level.

class Environment {
  constructor(/*json of environment*/ previousEnvironment = null) {
    this.updateScaleFactors();
    this.initializeEnvironment(previousEnvironment);
  }

  //Initialize the environment depending on whether it is a new game or a
  //recreation of a previous environment
  initializeEnvironment(previousEnvironment) {
    if (previousEnvironment) {
      this.retainOngoingGameObjects(previousEnvironment);
    } else {
      this.initializeDefaultGameObjects();
    }
    //restart the world

    this.initializeCommonGameObjects();
    // console.log(
    //   previousEnvironment ? "Environment recreated" : "Environment created"
    // );
  }

  //Necessary for scaling the environment when the window is resized
  retainOngoingGameObjects(previousEnvironment) {
    this.score = previousEnvironment.score;
    this.timer = previousEnvironment.timer;
    this.mouseBarrierActive = previousEnvironment.mouseBarrierActive;
  }

  initializeDefaultGameObjects() {
    this.score = 0;
    this.timer = null;
    this.mouseBarrierActive = true;
  }

  initializeCommonGameObjects() {
    this.addBoundaries();
    this.receptacle = new Receptacle(
      "default",
      this.scaleFactorX,
      this.scaleFactorY
    );
    this.throwable = new Throwable(
      "tennisball",
      this.scaleFactorX,
      this.scaleFactorY
    );
    this.platforms = [];

    this.platforms.push(
      new Platform(
        { x: width / 4, y: height },
        (width / 2) * this.scaleFactorX,
        100 * this.scaleFactorY,
        40
      )
    );
    this.platforms.push(
      new Platform(
        { x: 400 * this.scaleFactorX, y: height / 2 },
        200 * this.scaleFactorX,
        100 * this.scaleFactorY,
        0
      )
    );

    this.gravity = createVector(0, 9.8);
    this.wind = createVector(0, 0);
    this.backgroundimage = null;
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
    this.throwable.update(this);
    Matter.Engine.update(engine);
    // this.receptacle.update(this);

    // this.scoreboard.update(this);
  }
  display() {
    this.throwable.display();
    this.receptacle.display();
    this.platforms.forEach((platform) => platform.display(this));
    // this.scoreboard.display(this);
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
      // Destroy throwable
      this.throwable.destroy();
      this.throwable = null;

      // Destroy receptacle
      this.receptacle.destroy();
      this.receptacle = null;

      // Destroy platforms
      this.platforms.forEach((platform) => platform.destroy());
      this.platforms = null;

      //nuke the whole world >:)
      World.clear(world, false);

      //notify destruction
      console.log("Environment destroyed");

      // Resolve the promise after completing the destroy process
      resolve();
    });
  }
}
