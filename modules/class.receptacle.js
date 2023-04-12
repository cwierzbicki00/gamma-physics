//     file name: class.receptacle.js
//        authors: Quoc, Ryan Smith
//  date created: 02 Mar 2023
// date modified: 17 Mar 2023 (rsmith)

// description: Contains a base class for a receptacle object, which is
//              intended to be a target for the player to toss the throwable
//              at.


class Receptacle {
  
    constructor(vertices) {
      
        // size parameters for the receptacle
        let size = vertices.length;
        // size parameters for the receptacle
        this.vertices = vertices;
        let point0 = vertices[0];
        let point1 = vertices[(0 +size/2) % size];
        let point2 = vertices[1];
        let point3 = vertices[(1 + size/2)  % size];
        this.center = lineLineIntersection(point0, point1, point2, point3);


        this.vertices = vertices;
        this.edges = [];

        this.score = 0; // rsmith - tracks the score of the receptacle
      
        for (let i = 0; i < this.vertices.length; i++) {
            let start = this.vertices[i];
            let end = this.vertices[(i + 1) % this.vertices.length];
            let edge = createVector(end.x - start.x, end.y - start.y);
            this.edges.push(edge);
        }
    }
      
    // should handle friction to return range(0, 1)
    // simple handler for testing
    // assume this.friction in range(0,1)
    getBounceForce() {
        return 1 - this.friction;
    }

    getScore() {
        return this.score;
    }

    setScore(score) {
        this.score = score;
    }
  
    // return true if the ball score
    // vertex 0 and 1 create the entrance edge, the only edge that does not collide with the ball.
    OnCollisionEnter(ball) {
        let scored = false; // rsmith


        for(let i = 0 ; i < this.vertices.length; i++) 
        {
            if(p5.Vector.sub(ball.pos, this.vertices[i]).mag() < ball.getRadius())
            {
                let ballToVer = p5.Vector.sub(ball.pos, this.vertices[i]);
                ball.vel = getBounceVelocity(createVector(-ballToVer.y, ballToVer.x), ball.vel);
                ball.pos = ballPosAfterCollide(ball.pos, this.vertices[i], ball.getRadius());
                break;
            }
        }



        for (let i = 0; i < this.edges.length; i++) {
            //CONTAIN TESTING VARIABLES
            let edge = this.edges[i];
            let edgeStart = this.vertices[i];
            let edgeEnd = this.vertices[(i + 1) % this.vertices.length];
            let ballPerpenEnd = vectorProjection(ball.pos, edge);
            let ballImgOnEdge = lineLineIntersection(edgeStart, edgeEnd, ball.pos, ballPerpenEnd);
            if (isPointInBetween(edgeStart, edgeEnd, ballImgOnEdge) === 1) {
                if (dist(ball.pos.x, ball.pos.y, ballImgOnEdge.x, ballImgOnEdge.y) < ball.getRadius()) {
                    if (i === 0) { // if the ball collides with the entry (top) edge
                        // set to true so next collision will reset it
                        ball.inside = true; // rsmith
                        scored = true; // rsmith - sets return value to true
                        break;
                    } else { // if the ball collides with a non-entry edge
                        ball.vel = getBounceVelocity(edge, ball.vel);
                        ball.pos = ballPosAfterCollide(ball.pos, ballImgOnEdge, ball.getRadius());
                        // rsmith
                        if (ball.inside) { // if the ball has entered the receptacle
                            this.setScore(this.getScore() + 1); // increment the score
                            ball.reset(); // reset the ball
                        }
                        break;
                    }
                }
            }
        }
        return scored; // rsmith - boolean to track if score should be incremented
    }

    show() {
        beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
            strokeWeight(3);
            stroke(0, 255, 0);
            vertex(this.vertices[i].x, this.vertices[i].y);
        }
        endShape(CLOSE);
        fill(0, 255, 0, 100);
        noStroke();
        circle(this.center.x, this.center.y, 100);
    }
  
    // return true if the ball score
    update(ball) {
        return this.OnCollisionEnter(ball);
    }
}

// value > max? value = max: value
// value < min? value = min: value
function clamp(val, minVal, maxVal) {
    return min(max(val, minVal), maxVal);
}

function vectorProjection(a, b) {
    let bCopy = b.copy().normalize();
    let sp = a.dot(bCopy);
    bCopy.mult(sp);
    return bCopy;
}

function lineLineIntersection(A, B, C, D) {
    // Line AB represented as a1x + b1y = c1
    const a1 = B.y - A.y;
    const b1 = A.x - B.x;
    const c1 = a1 * A.x + b1 * A.y;

    // Line CD represented as a2x + b2y = c2
    const a2 = D.y - C.y;
    const b2 = C.x - D.x;
    const c2 = a2 * C.x + b2 * C.y;

    const determinant = a1 * b2 - a2 * b1;

    if (determinant === 0) {
        // The lines are parallel. Return null.
        return null;
    } else {
        const x = (b2 * c1 - b1 * c2) / determinant;
        const y = (a1 * c2 - a2 * c1) / determinant;
        return createVector(x, y);
    }
}

function isPointInBetween(a, b, c) {
    let min = a.x < b.x ? a.x : b.x;
    let max = a.x > b.x ? a.x : b.x;
    if (c.x > min && c.x < max) return 1;
    else return 0;
}

function ballPosAfterCollide(A, B, R) {
    // Find the direction vector from A to B
    let direction = p5.Vector.sub(A, B);

    // Normalize the direction vector
    direction.normalize();

    // Multiply the direction vector by R to get the magnitude of R
    direction.mult(R * 1.2);

    // Add the direction vector to point B to get supposed A after collide
    return p5.Vector.add(B, direction);
}

function getBounceVelocity(edge, vel) {
    let rot = atan2(edge.y, edge.x);
    let cos = Math.cos(rot);
    let sin = Math.sin(rot);
    let vel_x = cos * vel.x + sin * vel.y;
    let vel_y = cos * vel.y - sin * vel.x;
    let velx = cos * vel_x + sin * vel_y;
    let vely = sin * vel_x - cos * vel_y;
    return createVector(velx, vely);
}
