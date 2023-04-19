//     file name: class.throwable.js
//       authors: Ryan Smith
//  date created: 02 Mar 2023
// date modified: 13 Apr 2023 (rsmith)

// description: Contains a base class for a throwable object, which is
//              manipulated by the player to be tossed at a receptacle.

class Throwable {
  constructor(ballType) {
    switch (ballType) {
      case "basketball":
        this.type = "basketball";
        this.mass = 0.625; // kilograms
        this.bounce = 0.6; // testing
        this.radius = 74;
        this.img = loadImage("https://i.imgur.com/d5B8YI0.png");
        break;
      case "bowlingball":
        this.type = "bowlingball";
        this.mass = 6.8;
        this.bounce = 0.1; // testing
        this.radius = 72;
        this.img = loadImage("https://i.imgur.com/NTqjnK4.png");
        break;
      case "golfball":
        this.type = "golfball";
        this.mass = 0.046;
        this.bounce = 0.85; // testing
        this.radius = 18;
        this.img = loadImage("https://i.imgur.com/cXYIMIm.png");
        break;
      case "tennisball":
        this.type = "tennisball";
        this.mass = 0.056;
        this.bounce = 0.75; // testing
        this.radius = 26;
        this.img = loadImage("https://i.imgur.com/ZL0oho5.png");
        break;
      default:
        throw new Error("Invalid ball type");
    }

    // positional variables
    this.initialPos = { x: 150, y: height - 150 };
    this.angle = 0;
    this.angleV = 0;

    // status variables
    this.dragging = false;
    this.rollover = false;
    this.bounceCount = 0;
    this.inside = false;
    this.irrecoverable = false;
    this.resetTimer = false;

    let option = {
      friction: 0.001,
      mass: 10,
      restitution: this.bounce,
      label: "Ball",
    };
    this.body = Bodies.circle(
      this.initialPos.x,
      this.initialPos.y,
      this.radius,
      option
    );
    World.add(world, this.body);
  }

  print() {
    console.log(this.type);
  }

  getRadius() {
    return this.radius;
  }
  getDragging() {
    return this.dragging;
  }

  // updates the location of the throwable on the screen
  update(environment) {
    this.mousePressed(environment);
    this.recover();
  }

  display() {
    push();

    // color parameters for the throwable
    //stroke(255);
    //strokeWeight(2);
    // TODO this stuff is broken
    if (this.dragging) {
      tint(255, 50);
    } else if (this.rollover) {
      tint(255, 100);
    } else {
      tint(255, 200);
    }
    imageMode(CENTER);

    // Translate the origin to the position of the ball
    translate(this.body.position.x, this.body.position.y);
    // Calculate the angle of rotation based on the angle of the body
    let angle = this.body.angle;
    // Rotate the image around its center pivot
    rotate(angle);
    // Draw the image with its center pivot at the ball's position
    image(this.img, 0, 0, this.img.width, this.img.height);

    pop();
  }

  // allow user to drag ball if it was clicked on
  mousePressed(environment) {
    if (mConstraint.body && environment.getBarrierStatus()) {
      console.log(mConstraint.body.label);
      this.dragging = true;
      const pos = this.body.position;
      const offset = mConstraint.constraint.pointB;
      const m = mConstraint.mouse;
      const forceVector = {
        x: (m.position.x - pos.x - offset.x) * 0.001,
        y: (m.position.y - pos.y - offset.y) * 0.001,
      };
      Matter.Body.applyForce(this.body, pos, forceVector);
      // Limit the ball's maximum velocity
      const maxVelocity = 20;
      const currentVelocity = Matter.Vector.magnitude(this.body.velocity);
      if (currentVelocity > maxVelocity) {
        const newVelocity = Matter.Vector.mult(
          Matter.Vector.normalise(this.body.velocity),
          maxVelocity
        );
        Matter.Body.setVelocity(this.body, newVelocity);
      }
    } else this.dragging = false;
  }

  // recover the throwable from beyond the mouse barrier after N seconds
  recover() {
    let time = 5; // seconds
    let timer;
    this.irrecoverable = this.body.position.x > windowWidth * 0.2;
    if (this.irrecoverable && !this.resetTimer) {
      this.resetTimer = true;
      timer = setInterval(() => {
        console.log("Time until recovery: " + time + " seconds");
        time--;
        if (!this.irrecoverable) {
          console.log("Recovery timer cancelled");
          this.resetTimer = false;
          clearInterval(timer);
        }
        if (time === 0) {
          this.reset();
          clearInterval(timer);
        }
      }, 1000);
    }
  }

  // Reset ball to initial state
  reset() {
    Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
    Matter.Body.setPosition(this.body, this.initialPos);
    this.irrecoverable = false;
    this.resetTimer = false;
    this.inside = false;
    this.bounceCount = 0;
    console.log("Throwable reset");
  }
}
