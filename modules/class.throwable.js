//     file name: class.throwable.js
//        authors: Ryan Smith
//  date created: 20 Feb 2023
// date modified: 20 Feb 2023

// description: Contains an abstract base class for a throwable object, and
//              other derived classes of specific throwable objects.

// ---------------------------------------------------------- throwable: base --
class throwable {
    constructor () {
        // throw an exception if abstract class ctor is called
        if (this.constructor === throwable) {
            throw new Error("Attempted instantiation of abstract base class.")
        }
        this.type = 'abstract parent';

        // physical properties
        this.weight = 0.0; // in kg
        this.radius = 0.0; // in cm
        this.color = color(211, 211, 211); // default: light grey

        // physics properties
        this.bounciness = 0; // may need updated to appropriate p5.js property
        this.skinFriction = 0.0; // ^^

        // positioning properties
        this.currX = 0;
        this.currY = 0;

    }
    print() {
        console.log(this.type);
    }

    movementThroughAir(beginX = this.currX, beginY = this.currY){
        let step = 0.01; // Size of each step along the path
        let pct = 0.0; // Percentage traveled (0.0 to 1.0)
        let exponent = 4; // Determines the curve (derive from weight?)

        let distX = mouseX - this.currX;
        let distY = mouseY - this.currY;

        pct += step;
        if (pct < 1.0) {
            this.currX = beginX + pct * distX;
            this.currY = beginY + pow(pct, exponent) * distY;
        }
    }
}

// ---------------------------------------------------- throwable: ballTennis --
class ballTennis extends throwable { // 'extends' inherits base class
    constructor() {
        super(); // call ctor of abstract base class
        this.type = 'tennis ball';
        // TODO set object variables to those specific to a tennis ball
    }

    // call base class movement and pass this object's properties
    movementThroughAir() {
        super.movementThroughAir(this.currX, this.currY);
    }
}

// --------------------------------------------------- throwable: ballWhiffle --
class ballWhiffle extends throwable { // 'extends' inherits base class
    constructor() {
        super(); // call ctor of abstract base class
        this.type = 'whiffle ball';
        // TODO set object variables to those specific to a whiffle ball
    }

    // call base class movement and pass this object's properties
    movementThroughAir() {
        super.movementThroughAir(this.currX, this.currY);
    }
}
