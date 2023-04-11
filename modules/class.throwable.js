//        authors: Ryan Smith

// Contains a base class for a throwable object, which is
// manipulated by the player to be tossed at a receptacle.

class throwable {
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

    this.type = null; // setting type of ball in buildBall() based on which type of ball

    this.bounceCount = 0; // Initialize the bounce count to zero
    this.initialPos = createVector(x, y); // Store the initial position of the ball

    // create image property
    this.img = null;

    // rsmith - tracks if mouse barrier is enabled
    this.mouseBarrierActive = true;
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
    return this.r;
  }

  // Calculate the distance between the mouse and the center of the ball
  over(x, y) {
    let distance = dist(x, y, this.pos.x, this.pos.y);
    this.rollover = distance <= this.r;
    return this.rollover;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  // rebounds the throwable if it collides with an edge of the canvas
  edges() {
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

  // releases the throwable if the mouse moves outside of left 20%
  // of canvas and if the throwable is being dragged
  mouseOutOfBounds() { // rsmith
    if (this.mouseBarrierActive && mouseX > windowWidth * 0.2) { // sets boundary to left 20% of canvas
      this.released();
    }
  }

  // updates the location of the throwable on the screen
  // helper function for pressed()
  update() {
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
      tint(255, 50);
    } else if (this.rollover) {
      tint(255, 100);
    } else {
      tint(255, 200);
    }

    rotate(this.angle);

    imageMode(CENTER);
    image(this.img, 0, 0, this.img.width, this.img.height); // replace ellipse() with image()

    pop();
  }

  // allow user to drag ball if it was clicked on
  pressed(x, y) {
    if (this.mouseBarrierActive) {
      if (this.over(x, y) && (mouseX < windowWidth * 0.2)) { // rsmith 2nd cond.
        // second condition prevents user from clicking ball
        // while outside the left 20% of the canvas
        this.dragging = true;
        this.offset.set(this.pos.x - mouseX, this.pos.y - mouseY);
      }
    }
    else {
        if (this.over(x, y)) {
          this.dragging = true;
          this.offset.set(this.pos.x - mouseX, this.pos.y - mouseY);
        }
      }
    }
  
  // throw the ball when mouse is released
  released() {
    if (this.dragging) {
      this.dragging = false;
      this.vel.x = this.pos.x - this.prev.x;
      this.vel.y = this.pos.y - this.prev.y;
      this.vel.mult(0.1);
    }
  }

  // Reset ball to initial state
  reset() {
    this.pos = this.initialPos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.bounceCount = 0; // Reset the bounce count to zero
  }
}
