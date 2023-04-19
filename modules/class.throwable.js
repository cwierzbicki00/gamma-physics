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
        this.initialPos = {x:150,y:height - 150};
        this.angle      = 0;
        this.angleV     = 0;

        // status variables
        this.dragging      = false;
        this.rollover      = false;
        this.bounceCount   = 0;
        this.inside        = false;
        this.irrecoverable = false;
        this.resetTimer    = false;
        
        let option = {
            mass: this.mass,
            restitution: this.bounce,
            render:{
                fillStyle: '#ff0000',
                strokeStyle: 'pink',
                lineWidth: 10
            },
            label: 'Ball'
        }
        this.body = Bodies.circle(this.initialPos.x, this.initialPos.y , this.radius * 2,option);
        World.add(world,this.body);
        console.log("Throwable " + this.type + " created");
    }

    print() {
        console.log(this.type);
    }

    getRadius()   { return this.radius; }
    getDragging() { return this.dragging; }

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
        ellipse(this.body.position.x, this.body.position.y, this.radius * 2, this.radius * 2);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.img, this.body.position.x, this.body.position.y, this.img.width, this.img.height);
        pop();
    }

    // allow user to drag ball if it was clicked on
    mousePressed(environment) {
        if (mConstraint.body && environment.getBarrierStatus()) 
        {
            console.log(mConstraint.body.label);
            this.dragging = true;
            const pos = this.body.position;
            const offset = mConstraint.constraint.pointB;
            const m = mConstraint.mouse;
            const forceVector = {
            x: (m.position.x - pos.x - offset.x) * 0.00001,
            y: (m.position.y - pos.y - offset.y) * 0.00001
            };
            Matter.Body.applyForce(this.body, pos, forceVector);
            // Limit the ball's maximum velocity
            const maxVelocity = 20;
            const currentVelocity = Matter.Vector.magnitude(this.body.velocity);
            if (currentVelocity > maxVelocity) {
                const newVelocity = Matter.Vector.mult(Matter.Vector.normalise(this.body.velocity), maxVelocity);
                Matter.Body.setVelocity(this.body, newVelocity);
            }
        }   
        else
            this.dragging = false;     
    }
    applyThrowForce() {
        // mouse movement speed
        let mx = (mouseX - pmouseX);
        let my = (mouseY - pmouseY);
        console.log(mx);
        console.log(my);
        let mouse_speed = {x:mx , y: my};

        // mouse acceleration
        let ax = mouse_speed.x / this.mass;
        let ay = mouse_speed.y / this.mass;
        // move position based on velocity
        Matter.Body.applyForce(this.body,this.body.position, {x: ax, y: ay});
    }

    // recover the throwable from beyond the mouse barrier after N seconds
    recover() {
        let time = 15; // seconds
        let timer;
        this.irrecoverable = this.body.position.x > windowWidth * 0.2;
        if (this.irrecoverable && !this.resetTimer) {
            this.resetTimer = true;
            timer = setInterval(() => {
                console.log('Time until recovery: ' + time + ' seconds');
                time--;
                if (!this.irrecoverable){
                    console.log('Recovery timer cancelled');
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
        this.body.position = this.initialPos;
        this.irrecoverable = false;
        this.resetTimer = false;
        this.inside = false;
        this.bounceCount = 0;
        console.log('Throwable reset');
    }
}
