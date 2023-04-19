//     file name: class.receptacle.js
//       authors: Quoc, Ryan Smith
//  date created: 02 Mar 2023
// date modified: 13 Apr 2023 (rsmith)

// description: Contains a base class for a receptacle object, which is
//              intended to be a target for the player to toss the throwable
//              at.


class Receptacle {

    constructor(receptacleType) {

        this.edges = [];
        this.rType = receptacleType;
        switch(receptacleType) {
            case 'goblet':
                break;

            case 'net':
                break;

            case 'trashcan':
                break;

            case 'vase':
                break;

            default:
                this.vertices = [
                    { x: width / 2 - 50, y: height / 2 - 100 },
                    { x: width / 2 + 50, y: height / 2 - 100 },
                    { x: width / 2 + 100, y: height / 2 },
                    { x: width / 2 + 50, y: height / 2 + 100 },
                    { x: width / 2 - 50, y: height / 2 + 100 },
                    { x: width / 2 - 100, y: height / 2 },
                  ];
                let option = {
                    isStatic: true,
                    label: 'receptacle',
                    render:{
                        fillStyle: '#ff0000',
                        strokeStyle: 'pink',
                        lineWidth: 10
                    }
                }
                this.body = Bodies.fromVertices(
                    width / 2, 
                    height / 2, 
                    this.vertices, 
                    option
                );
        }
        // Detect when the polygon collides with another body
        // World.add(world, this.body);
        World.add(world, this.body);
    }
    display() {
        beginShape();
        for (let i = 0; i < this.vertices.length; i++) {
            strokeWeight(50);
            stroke(0, 255, 0);
            vertex(this.vertices[i].x, this.vertices[i].y);
        }
        endShape(CLOSE);
        fill(0, 255, 0, 100);
        noStroke();
    } 
    // should handle friction to return range(0, 1)
    // simple handler for testing
    // assume this.friction in range(0,1)
    getBounceForce() {
        return 1 - this.friction;
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

    // Multiply the direction vector by 5 to get the magnitude of 5
    direction.mult(R);

    // Add the direction vector to point A to get point C
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
