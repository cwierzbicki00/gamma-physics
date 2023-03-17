//     file name: class.throwable.js
//        authors: Ryan Smith
//  date created: 20 Feb 2023
// date modified: 06 Mar 2023

// description: Contains a base class for a throwable object, which is
//              manipulated by the player to be tossed at a receptacle.

class throwable {
  // --------------------------------------------------------------------- ctor --
  constructor(x, y, m) {
    // size parameters for the throwable
    this.mass = m;
    //this.r = sqrt(this.mass) * 16; // sets radius of the throwable
    this.r = null; // setting radius of ball in buildBall() based on which type of ball

    this.dragging = false;
    this.rollover = false;
    this.offset = createVector();
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.angle = 0;
    this.angleV = 0;
    this.prev = createVector();

    //this.type = "baseball"; // TODO change to update with menu selection
    this.type = null; // setting type of ball in buildBall() based on which type of ball

    //Christian added ->
    this.bounceCount = 0; // Initialize the bounce count to zero
    this.initialPos = createVector(x, y); // Store the initial position of the ball

    // create image property
    this.img = null;
  }

  //========SETTERS================
  setRad(rad) {
    this.r = rad;
  }

  setType(ball) {
    this.type = ball;
  }
  //===============================

  print() {
    console.log(this.type);
  }

  getRadius() {
    // *4 is from the main branch, maybe for someone testing purpose
    return this.r;
  }

  over(x, y) {
    // Calculate the distance between the mouse and the center of the ball
    let distance = dist(x, y, this.pos.x, this.pos.y);
    
    // removed * 2 (?)
    this.rollover = distance <= this.r;
    return this.rollover;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  edges() {
    // rebounds the throwable if it collides with an edge of the canvas

    if (this.pos.y >= height - this.r) {
      // bottom edge
      this.pos.y = height - this.r;
      this.vel.y *= -0.95;
      this.bounceCount++;
    } else if (this.pos.y <= this.r) {
      // top edge
      this.pos.y = this.r;
      this.vel.y *= -0.95;
      this.bounceCount++;
    }

    if (this.pos.x >= width - this.r) {
      // right edge
      this.pos.x = width - this.r;
      this.vel.x *= -0.95;
      this.bounceCount++;
    } else if (this.pos.x <= this.r) {
      // left edge
      this.pos.x = this.r;
      this.vel.x *= -0.95;
      this.bounceCount++;
    }
  }

  mouseOutOfBounds() { // rsmith
    // releases the throwable if the mouse moves outside of left 20%
    // of canvas and if the throwable is being dragged

    if (mouseX > windowWidth * 0.2) { // sets boundary to left 20% of canvas
      this.released();
    }
  }

  update() {
    // updates the location of the throwable on the screen
    // helper function for pressed()

    if (this.dragging) {
      this.prev.lerp(this.pos, 0.1);
      this.pos.x = mouseX + this.offset.x;
      this.pos.y = mouseY + this.offset.y;
      this.vel.set(0, 0);
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.angleV = this.vel.x * 0.05;
    this.angle += this.angleV;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // color parameters for the throwable
    stroke(255);
    strokeWeight(2);

    if (this.dragging) {
      //fill(255, 50);
      tint(255, 50); // replace fill() with tint()
    } else if (this.rollover) {
      //fill(255, 100);
      tint(255, 100);
    } else {
      tint(255, 200);
    }

    rotate(this.angle);

    imageMode(CENTER);
    image(this.img, 0, 0, this.img.width, this.img.height); // replace ellipse() with image()

    pop();
  }

  pressed(x, y) {
    // allow user to drag ball if it was clicked on

    if(this.over(x, y) && (mouseX < windowWidth * 0.2)) { // rsmith 2nd cond.
      // second condition prevents user from clicking ball
      // while outside the left 20% of the canvas
      this.dragging = true;
      this.offset.set(this.pos.x - mouseX, this.pos.y - mouseY);
    }
  }

  released() {
    // throw the ball when mouse is released
    if (this.dragging) {
      this.dragging = false;
      this.vel.x = this.pos.x - this.prev.x;
      this.vel.y = this.pos.y - this.prev.y;
      this.vel.mult(0.1);
    }
  }

  reset() {
    // Reset ball to initial state
    this.pos = this.initialPos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.bounceCount = 0; // Reset the bounce count to zero
  }

}
