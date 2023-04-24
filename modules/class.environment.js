//     file name: class.environment.js
//       authors: Quoc, Ryan Smith
//  date created: 13 Apr 2023
// date modified: 13 Apr 2023 (rsmith)

// description: Contains a base class for an environment object, which is
//              intended to hold information related to the current level.

class Environment {
  constructor(/*json file*/) {
    // game objects
    this.addBoundaries();
    this.receptacle = new Receptacle("default");
    this.throwable = new Throwable("tennisball");
    this.popup = new Popup(200, 200, 200, 200, "test");
    this.popup.display();
    this.platforms = [];
    this.platforms.push(
      new Platform({ x: width / 4, y: height }, width / 2, 100, 40)
    );
    this.platforms.push(new Platform({ x: 400, y: height / 2 }, 200, 100, 0));

    // TODO awaiting implementation of scoreboard class
    // this.scoreboard = new scoreboard();

    // environmental physics
    this.gravity = createVector(0, 9.8); // earth gravity: 9.8 m/s^2
    this.wind = createVector(0, 0); // wind force: 0 m/s^2
    this.backgroundimage = null;
    // TODO move into class.scoreboard.js
    // scoreboard variables
    this.score = 0;
    this.timer = null;

    this.mouseBarrierActive = true;

    console.log("Environment created");
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
    this.throwable = new Throwable(newType);
  }
  setReceptacle(newType) {
    this.receptacle = new Receptacle(newType);
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
}
