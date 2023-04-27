// file name: class.receptacle.js
// authors: Quoc, Ryan Smith
// date created: 02 Mar 2023
// date modified: 13 Apr 2023 (rsmith)

// description: Contains a base class for a receptacle object, which is
// intended to be a target for the player to toss the throwable
// at.

class Receptacle {
  constructor(receptacleType, scaleFactorX, scaleFactorY, edit) {
    this.edges = [];
    this.rType = receptacleType;
    this.walls = [];
    this.edit = edit;

    const openingSize = 80 * scaleFactorX; // Adjust the size of the opening as needed
    switch (receptacleType) {
      case "goblet":
        console.log("goblet receptacle created");
        break;

      case "net":
        console.log("net receptacle created");
        break;

      case "trashcan":
        this.buildTrashcan(scaleFactorX, scaleFactorY);
        console.log("trashcan receptacle created");
        break;

      case "vase":
        console.log("vase receptacle created");
        break;

      default:
        this.buildDefaultReceptacle(scaleFactorX, scaleFactorY, openingSize);
    }
  }

  buildTrashcan(scaleFactorX, scaleFactorY) {
    let vertices;

    if (level == 1) {
      vertices = [
        { x: 1306 * scaleFactorX, y: 635 * scaleFactorY },
        { x: 1337 * scaleFactorX, y: 804 * scaleFactorY },
        { x: 1470 * scaleFactorX, y: 804 * scaleFactorY },
        { x: 1498 * scaleFactorX, y: 635 * scaleFactorY },
      ];
    } else if (level == 2) {
      vertices = [
        { x: 1303 * scaleFactorX, y: 336 * scaleFactorY },
        { x: 1325 * scaleFactorX, y: 502 * scaleFactorY },
        { x: 1474 * scaleFactorX, y: 508 * scaleFactorY },
        { x: 1497 * scaleFactorX, y: 335 * scaleFactorY },
      ];
    } else if (level == 3) {
      vertices = [
        { x: 1164 * scaleFactorX, y: 595 * scaleFactorY },
        { x: 1193 * scaleFactorX, y: 756 * scaleFactorY },
        { x: 1332 * scaleFactorX, y: 761 * scaleFactorY },
        { x: 1359 * scaleFactorX, y: 585 * scaleFactorY },
      ];
    }

    this.thickness = 5;
    this.walls = [];
    this.wallsBounds = [];
    for (let i = 0; i < vertices.length - 1; i++) {
      let z = this.createRectangle(vertices[i], vertices[i + 1]);
      this.walls.push(z);
    }
    // Create a Matter.js body for the polygon
    // Add the trashcan to the Matter.js world
    World.add(engine.world, this.walls);
  }

  buildDefaultReceptacle(scaleFactorX, scaleFactorY, openingSize) {
    const wallThickness = 10 * scaleFactorX;
    const centerX = 350 * 4 * scaleFactorX;
    const centerY = 104 * 4 * scaleFactorY;
    const halfWidth = 100 * scaleFactorX;
    const halfHeight = 100 * scaleFactorY;

    // Define the receptacle walls
    const walls = [
      Bodies.rectangle(
        centerX - halfWidth,
        centerY,
        wallThickness,
        halfHeight * 2,
        {
          isStatic: true,
          label: "receptacle",
        }
      ),
      Bodies.rectangle(
        centerX + halfWidth,
        centerY,
        wallThickness,
        halfHeight * 2,
        {
          isStatic: true,
          label: "receptacle",
        }
      ),
      Bodies.rectangle(
        centerX,
        centerY + halfHeight,
        halfWidth * 2 + wallThickness,
        wallThickness,
        {
          isStatic: true,
          label: "receptacle",
        }
      ),
      Bodies.rectangle(
        centerX - halfWidth + openingSize / 2,
        centerY - halfHeight,
        openingSize / 2,
        wallThickness,
        {
          isStatic: true,
          label: "receptacle",
        }
      ),
      Bodies.rectangle(
        centerX + halfWidth - openingSize / 2,
        centerY - halfHeight,
        openingSize / 2,
        wallThickness,
        {
          isStatic: true,
          label: "receptacle",
        }
      ),
    ];

    // Add the walls to the world
    World.add(world, walls);

    // Store the wall bodies for rendering
    this.walls = walls;
  }

  display() {
    for (let i = 0; i < this.walls.length; i++) {
      let wall = this.walls[i];
      let bound = this.wallsBounds[i];
      push();
      if (edit) {
        fill(255); //set to white if in edit mode
      } else {
        fill(0, 0); //set to transparent if not in edit mode
      }
      stroke(0, 0); // set the stroke color to black
      translate(wall.position.x, wall.position.y); // translate to the correct position after rotation
      rotate(wall.angle);

      rectMode(CENTER);
      rect(0, 0, bound.x, bound.y);
      pop();
    }
  }

  checkForEntry(throwable) {
    if (throwable.body === null) return;
    const tPos = throwable.body.position;
    const firstVertex = this.walls[0].position;
    const lastVertex = this.walls[this.walls.length - 1].position;

    // Check if the throwable is within the receptacle bounds defined by the first and last vertices
    if (
      tPos.x > firstVertex.x &&
      tPos.x < lastVertex.x &&
      tPos.y > firstVertex.y
    ) {
      console.log("Throwable entered the receptacle!");

      // Increase the score and reset the throwable
      //Add different scores depending on the throwable type:
      if (throwable.type == "tennisball") {
        environment.addScore(1);
      } else if (throwable.type == "basketball") {
        environment.addScore(2);
      } else if (throwable.type == "golfball") {
        environment.addScore(1);
      } else if (throwable.type == "bowlingball") {
        environment.addScore(3);
      }

      //Reset the throwable
      throwable.reset();
    }
  }

  createRectangle(vec1, vec2) {
    // Calculate the distance and angle between the two vectors
    let distance = Matter.Vector.magnitude(Matter.Vector.sub(vec1, vec2));
    let angle = Matter.Vector.angle(vec1, vec2);

    // Calculate the center point between the two vectors
    let center = {
      x: (vec1.x + vec2.x) / 2,
      y: (vec1.y + vec2.y) / 2,
    };

    // Create a rectangle body using the center point, distance, and thickness
    let rect = Matter.Bodies.rectangle(
      center.x,
      center.y,
      distance,
      this.thickness,
      {
        isStatic: true,
        angle: angle,
      }
    );
    // Return the rectangle body
    this.wallsBounds.push({ x: distance, y: this.thickness });
    return rect;
  }

  destroy() {
    //World.remove(world, this.body);
    delete this;
  }
}
