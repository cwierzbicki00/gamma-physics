//     file name: class.throwable.js
//       authors: Ryan Smith, Christian Wierzbicki
//  date created: 02 Mar 2023
// date modified: 24 Apr 2023 (rsmith)

// description: Contains a base class for a throwable object, which is
//              manipulated by the player to be tossed at a receptacle.

class Throwable {
  constructor(ballType, scaleFactorX, scaleFactorY) {
    // Add dragArea property
    this.dragArea = {
      x: width / 5 - 150,
      y: height - 100 - 150,
      width: 300,
      height: 300,
    };

    //so we may use in display to scale image as well
    this.scaleFactorX = scaleFactorX;
    this.scaleFactorY = scaleFactorY;

    switch (ballType) {
      case "basketball":
        this.type = "basketball";
        this.mass = 0.625; // kilograms
        this.bounce = 0.6; // testing
        this.radius = 74 * 0.75 * scaleFactorX;
        this.img = loadImage("https://i.imgur.com/d5B8YI0.png");
        this.option = {
          friction: 0.001,
          mass: 0.625, // kilograms
          restitution: 0.6, // testing
          label: "basketball",
        };
        console.log("basketball throwable created");
        break;
      case "bowlingball":
        this.type = "bowlingball";
        this.mass = 6.8;
        this.bounce = 0.1; // testing
        this.radius = 72 * 0.75 * scaleFactorX;
        this.img = loadImage("https://i.imgur.com/NTqjnK4.png");
        this.option = {
          friction: 0.001,
          mass: 6.8,
          restitution: 0.1,
          label: "bowlingball",
        };
        console.log("bowlingball throwable created");
        break;
      case "golfball":
        this.type = "golfball";
        this.mass = 0.046;
        this.bounce = 0.85; // testing
        this.radius = 18 * scaleFactorX;
        this.img = loadImage("https://i.imgur.com/cXYIMIm.png");
        this.option = {
          friction: 0.001,
          mass: 0.046,
          restitution: 0.85,
          label: "golfball",
        };
        console.log("golfball throwable created");
        break;
      case "tennisball":
        this.type = "tennisball";
        this.mass = 0.056;
        this.bounce = 0.9; // testing
        this.radius = 26 * scaleFactorX;
        this.img = loadImage("https://i.imgur.com/ZL0oho5.png");
        this.option = {
          friction: 0.001,
          mass: 0.056,
          restitution: 0.9,
          label: "tennisball",
        };
        console.log("tennisball throwable created");
        break;
      default:
        throw new Error("Invalid ball type");
    }

    // positional variables (adjust for resizing)
    this.initialPos = createVector(
      // initial position
      width / 5,
      height - 100 - this.radius - 10
    );
    this.angle = 0;
    this.angleV = 0;

    // status variables
    this.dragging = false;
    this.rollover = false;
    this.bounceCount = 0;
    this.inside = false;
    this.irrecoverable = false;
    this.resetTimer = false;

    // matter.js body
    this.body = Bodies.circle(
      this.initialPos.x,
      this.initialPos.y,
      this.radius,
      this.option
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

  // Check if mouse is inside the drag area
  isMouseInsideDragArea() {
    // return (
    //   mouseX >= this.dragArea.x &&
    //   mouseX <= this.dragArea.x + this.dragArea.width &&
    //   mouseY >= this.dragArea.y &&
    //   mouseY <= this.dragArea.y + this.dragArea.height
    // );
  }

  // Spawn a new ball of the same type
  spawnNewBall() {
    // Create a new ball if only 1 ball exists. Otherwise, do nothing.
    //THIS IS A TODO: Make it so that a new ball
    //is spawned when the ball is thrown into the basket, or if there are
    //no balls currently in the draggable area.
  }

  //constrain to bounds of screen
  constrainToBounds() {
    const buffer = 3;
    const minPosX = this.radius + buffer;
    const maxPosX = width - this.radius - buffer;
    const minPosY = this.radius + buffer;
    const maxPosY = height - this.radius - buffer;

    if (this.body.position.x < minPosX) {
      Matter.Body.setPosition(this.body, {
        x: minPosX,
        y: this.body.position.y,
      });
      Matter.Body.setVelocity(this.body, {
        x: Math.abs(this.body.velocity.x),
        y: this.body.velocity.y,
      });
    } else if (this.body.position.x > maxPosX) {
      Matter.Body.setPosition(this.body, {
        x: maxPosX,
        y: this.body.position.y,
      });
      Matter.Body.setVelocity(this.body, {
        x: -Math.abs(this.body.velocity.x),
        y: this.body.velocity.y,
      });
    }

    if (this.body.position.y < minPosY) {
      Matter.Body.setPosition(this.body, {
        x: this.body.position.x,
        y: minPosY,
      });
      Matter.Body.setVelocity(this.body, {
        x: this.body.velocity.x,
        y: Math.abs(this.body.velocity.y),
      });
    } else if (this.body.position.y > maxPosY) {
      Matter.Body.setPosition(this.body, {
        x: this.body.position.x,
        y: maxPosY,
      });
      Matter.Body.setVelocity(this.body, {
        x: this.body.velocity.x,
        y: -Math.abs(this.body.velocity.y),
      });
    }
  }

  //limit velocity of ball
  update(environment) {
    this.mousePressed(environment);
    this.limitVelocity();
    this.recover();
  }

  limitVelocity() {
    // Limit the ball's maximum velocity
    const maxVelocity = 25 * this.scaleFactorX;
    const currentVelocity = Matter.Vector.magnitude(this.body.velocity);
    if (currentVelocity > maxVelocity) {
      const newVelocity = Matter.Vector.mult(
        Matter.Vector.normalise(this.body.velocity),
        maxVelocity
      );
      Matter.Body.setVelocity(this.body, newVelocity);
    }
  }

  // updates the location of the throwable on the screen
  update(environment) {
    this.mousePressed(environment);
    this.recover();
    this.limitVelocity();
    this.constrainToBounds();
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
      tint(255, 255);
    } else {
      tint(255, 255);
    }
    imageMode(CENTER);

    // Translate the origin to the position of the ball
    translate(this.body.position.x, this.body.position.y);
    // Calculate the angle of rotation based on the angle of the body
    let angle = this.body.angle;
    // Rotate the image around its center pivot
    rotate(angle);
    // Draw the image with its center pivot at the ball's position

    //If the ball is a basketball or bowling ball draw 0.75 width and height
    if (this.type == "basketball" || this.type == "bowlingball") {
      image(
        this.img,
        0,
        0,
        this.img.width * 0.75 * this.scaleFactorX,
        this.img.height * 0.75 * this.scaleFactorY
      );
    } else {
      image(
        this.img,
        0,
        0,
        this.img.width * this.scaleFactorX,
        this.img.height * this.scaleFactorY
      );
    }

    pop();
  }

  // Check if the throwable is within the draggable area
  isWithinDraggableArea() {
    console.log(this.body.position.x <= width * 0.5);
    return this.body.position.x <= width * 0.5;
  }

  // allow user to drag ball if it was clicked on
  mousePressed(environment) {
    if (mConstraint.body == this.body && environment.getBarrierStatus()) {
      if (this.isWithinDraggableArea()) {
        //Stop the dragging if it's not in the draggable area
        console.log(mConstraint.body.label);
        this.dragging = true;
        const pos = this.body.position;
        const offset = mConstraint.constraint.pointB;
        const m = mConstraint.mouse;

        const averageScaleFactor = (this.scaleFactorX + this.scaleFactorY) / 2;
        const forceMultiplier = 0.0005 * averageScaleFactor; // Scale force multiplier based on screen size

        const forceVector = Vector.create(
          (m.position.x - pos.x - offset.x) * forceMultiplier,
          (m.position.y - pos.y - offset.y) * forceMultiplier
        );
        Matter.Body.applyForce(this.body, pos, forceVector);

        // Calculate the torque and apply it to the ball
        const spinMultiplier = 0.01;
        const spin = (m.position.x - pos.x - offset.x) * spinMultiplier;
        Matter.Body.setAngularVelocity(this.body, spin);

        // Limit the ball's maximum velocity
        const maxVelocity = 25 * this.scaleFactorX;
        const currentVelocity = Matter.Vector.magnitude(this.body.velocity);
        if (currentVelocity > maxVelocity) {
          const newVelocity = Matter.Vector.mult(
            Matter.Vector.normalise(this.body.velocity),
            maxVelocity
          );
          Matter.Body.setVelocity(this.body, newVelocity);
        }
      } else {
        this.dragging = false;
        // Detach the ball from the mouse constraint
        mConstraint.constraint.bodyB = null;
        // Clicked outside the draggable area, spawn a new ball
        this.spawnNewBall();
      }
    } else this.dragging = false;

    if (this.dragging && !this.isWithinDraggableArea()) {
      this.dragging = false;
      mConstraint.constraint.bodyB = null;
    }
  }

  // recover the throwable from beyond the mouse barrier after N seconds
  recover() {
    if (this.body) {
      let time = 15; // seconds
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
  }

  // Reset ball to initial state
  reset() {
    Matter.Body.setVelocity(this.body, Vector.create(0, 0));
    Matter.Body.setPosition(this.body, this.initialPos);
    this.irrecoverable = false;
    this.resetTimer = false;
    this.inside = false;
    this.bounceCount = 0;
    if (ballButton) {
      ballButton.remove();
      ballButton = null;
    }
    console.log("Throwable reset");
  }

  //destroy the throwable when we're done using it
  destroy() {
    World.remove(world, this.body);
    delete this;
    console.log("Throwable destroyed" + this);
  }
}
