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
            strokeWeight(3);
            stroke(0, 255, 0);
            vertex(this.vertices[i].x, this.vertices[i].y);
        }
        endShape(CLOSE);
        fill(0, 255, 0, 100);
        noStroke();
    } 
}
