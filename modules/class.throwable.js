//     file name: class.throwable.js
//        authors: Ryan Smith
//  date created: 20 Feb 2023
// date modified: 20 Feb 2023

// description: Contains an abstract base class for a throwable object, and
//              other derived classes of specific throwable objects.

// ---------------------------------------------------------- throwable: base --
class throwable {
  constructor(x, y, m) {
    this.dragging = false;
    this.rollover = false;
    this.offset = createVector();
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = sqrt(this.mass) * 16;
    this.angle = 0;
    this.angleV = 0;
    this.prev = createVector();
    this.type = "baseball"; // TODO change to update with menu selection

    //Christian added ->
    this.bounceCount = 0; // Initialize the bounce count to zero
    this.initialPos = createVector(x, y); // Store the initial position of the ball
  }

  print() {
    console.log(this.type);
  }

  over(x, y) {
    // Calculate the distance between the mouse and the center of the ball
    let distance = dist(x, y, this.pos.x, this.pos.y);

    // Check if the distance is less than or equal to the diameter of the ball
    //should be r*2 potentially.
    this.rollover = distance <= this.r * 4;
    return this.rollover;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  edges() {
    // rebounds object if it touches a window edge
    if (this.pos.y >= height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -0.95;

      this.bounceCount++; // Increment the bounce count
    }
    if (this.pos.x >= width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -0.95;

      this.bounceCount++; // Increment the bounce count
    } else if (this.pos.x <= this.r) {
      this.pos.x = this.r;
      this.vel.x *= -0.95;

      this.bounceCount++; // Increment the bounce count
    }
  }

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
    stroke(255);
    strokeWeight(2);
    if (this.dragging) {
      fill(255, 50);
    } else if (this.rollover) {
      fill(255, 100);
    } else {
      fill(255, 150);
    }
    rotate(this.angle);
    //Just to make the ball bigger (FOR NOW)
    ellipse(0, 0, this.r * 4);
    strokeWeight(4);
    line(0, 0, this.r, 0);
    pop();
  }

  pressed(x, y) {
    // allow user to drag ball if it was clicked on

    if (this.over(x, y)) {
      this.dragging = true;
      this.offset.set(this.pos.x - mouseX, this.pos.y - mouseY);
    }
  }

  released() {
    // throw the ball when mouse is released

    //fix:
    if (this.dragging) {
      this.dragging = false;
      this.vel.x = this.pos.x - this.prev.x;
      this.vel.y = this.pos.y - this.prev.y;
      this.vel.mult(0.1);
    }
    // this.dragging = false;
    // this.vel.x = this.pos.x - this.prev.x;
    // this.vel.y = this.pos.y - this.prev.y;
    // this.vel.mult(0.1);
  }

  reset() {
    // Reset ball to initial state
    this.pos = this.initialPos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.bounceCount = 0; // Reset the bounce count to zero
  }
}
