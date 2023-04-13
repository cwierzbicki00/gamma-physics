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
                this.type   = 'basketball';
                this.mass   = 0.625; // kilograms
                this.bounce = 0.6; // testing
                this.radius = 74;
                this.img    = loadImage("https://i.imgur.com/d5B8YI0.png");
                break;
            case "bowlingball":
                this.type   = 'bowlingball';
                this.mass   = 6.800;
                this.bounce = 0.1; // testing
                this.radius = 72;
                this.img    = loadImage("https://i.imgur.com/NTqjnK4.png");
                break;
            case "golfball":
                this.type   = 'golfball';
                this.mass   = 0.046;
                this.bounce = 0.85; // testing
                this.radius = 18;
                this.img    = loadImage("https://i.imgur.com/cXYIMIm.png");
                break;
            case "tennisball":
                this.type   = 'tennisball';
                this.mass   = 0.056;
                this.bounce = 0.75; // testing
                this.radius = 26;
                this.img    = loadImage("https://i.imgur.com/ZL0oho5.png");
                break;
            default:
                throw new Error("Invalid ball type");
        }

        // positional variables
        this.initialPos = createVector(150, height - 150);
        this.pos        = this.initialPos.copy();
        this.vel        = createVector(0, 0);
        this.acc        = createVector(0, 0);
        this.offset     = createVector();
        this.angle      = 0;
        this.angleV     = 0;
        this.prev       = createVector();

        // status variables
        this.dragging    = false;
        this.rollover    = false;
        this.bounceCount = 0;
        this.inside      = false;

        console.log("Throwable " + this.type + " created");
    }

    print() {
        console.log(this.type);
    }

    getRadius()   { return this.radius; }
    getDragging() { return this.dragging; }

    // updates the location of the throwable on the screen
    update(environment) {

        this.applyEnvironmentalForces(environment.getGravity(), environment.getWind());
        this.mouseOutOfBounds(environment);
        this.mouseDragged();
        this.edges();

        // if (this.dragging) {
        //     this.prev.lerp(this.pos, 0.1);
        //     this.pos.x = mouseX + this.offset.x;
        //     this.pos.y = mouseY + this.offset.y;
        //     this.vel.set(0, 0);
        // }

        // this.vel.add(this.acc);
        // this.pos.add(this.vel);
        // this.acc.set(0, 0);
        this.angleV = this.vel.x * 0.05;
        this.angle += this.angleV;
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

        rotate(this.angle);

        imageMode(CENTER);
        image(this.img, this.pos.x, this.pos.y, this.img.width, this.img.height);

        pop();
    }

    // allow user to drag ball if it was clicked on
    mousePressed(environment) {
        if (environment.getBarrierStatus()) {
            if (this.over() && (mouseX < windowWidth * 0.2)) {
                // second condition prevents user from clicking ball
                // while outside the left 20% of the canvas (rsmith)
                this.dragging = true;
                this.offset.set(this.pos.x - mouseX, this.pos.y - mouseY);
                this.prev.set(this.pos.x, this.pos.y);
            }
        } else {
            if (this.over()) {
                this.dragging = true;
                this.offset.set(this.pos.x - mouseX, this.pos.y - mouseY);
                this.prev.set(this.pos.x, this.pos.y);
            }
        }
    }

    mouseDragged() {
        if (this.dragging) {
            this.pos.set(mouseX + this.offset.x, mouseY + this.offset.y);
        }
    }

    // throw the ball when mouse is released
    mouseReleased() {
        if (this.dragging) {
            this.dragging = false;
            //this.applyThrowForce();

            // this.vel.x = this.pos.x - this.prev.x;
            // this.vel.y = this.pos.y - this.prev.y;
            // this.vel.mult(0.1);
        }
    }

    // Calculate the distance between the mouse and the center of the ball
    over() {
        let distance = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        this.rollover = distance <= this.radius;
        return this.rollover;
    }

    applyThrowForce() {

        // mouse movement speed
        let mx = (mouseX - pmouseX);
        let my = (mouseY - pmouseY);
        let mouse_speed = createVector(mx, my);

        // mouse acceleration
        let ax = mouse_speed.x / this.mass;
        let ay = mouse_speed.y / this.mass;
        let acceleration = createVector(ax, ay);

        // apply mouse speed to velocity
        this.vel.add(acceleration);

        // move position based on velocity
        this.pos.add(this.vel);
    }

    applyEnvironmentalForces(gravity = createVector(0, 9.8), wind= createVector(0, 0)) {

        // adding force of gravity to acceleration f = g * m
        let ax = gravity.x * this.mass;
        let ay = gravity.y * this.mass;
        let force = createVector(ax, ay);

        // adding force of wind to acceleration f = a * m
        let wx = wind.x * this.mass;
        let wy = wind.y * this.mass;
        force.add(createVector(wx, wy));

        this.acc.add(force);

        // apply acceleration to velocity
        this.vel.add(this.acc);

        // move position based on velocity
        this.pos.add(this.vel);

        // reset acceleration between each frame
        this.acc.set(0, 0);
    }

    // rebounds the throwable if it collides with an edge of the canvas
    edges() {

        if (this.pos.y >= height - this.radius) {
            // bottom edge
            this.pos.y = height - this.radius;
            this.vel.y *= -this.bounce;
            this.bounceCount++;
        } else if (this.pos.y <= this.radius) {
            // top edge
            this.pos.y = this.radius;
            this.vel.y *= -this.bounce;
            this.bounceCount++;
        }

        if (this.pos.x >= width - this.radius) {
            // right edge
            this.pos.x = width - this.radius;
            this.vel.x *= -this.bounce;
            this.bounceCount++;
        } else if (this.pos.x <= this.radius) {
            // left edge
            this.pos.x = this.radius;
            this.vel.x *= -this.bounce;
            this.bounceCount++;
        }
    }

    // releases the throwable if the mouse moves outside of left 20%
    // of canvas and if the throwable is being dragged
    mouseOutOfBounds(environment) {
        if (this.dragging &&
            environment.getBarrierStatus() &&
            mouseX > windowWidth * 0.2) {
            this.mouseReleased();
        }
    }

    // Reset ball to initial state
    reset() {
        this.pos = this.initialPos.copy();
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.inside = false;
        this.bounceCount = 0;
        console.log('Throwable reset');
    }
}
