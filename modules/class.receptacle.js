// file name: class.receptacle.js
// authors: Quoc, Ryan Smith
// date created: 02 Mar 2023
// date modified: 13 Apr 2023 (rsmith)

// description: Contains a base class for a receptacle object, which is
// intended to be a target for the player to toss the throwable
// at.

class Receptacle {
  constructor(receptacleType, scaleFactorX, scaleFactorY) {
    this.edges = [];
    this.rType = receptacleType;
    this.walls = [];

    const openingSize = 80 * scaleFactorX; // Adjust the size of the opening as needed
    switch (receptacleType) {
      case "goblet":
        console.log("goblet receptacle created");
        break;

      case "net":
        console.log("net receptacle created");
        break;

      case "trashcan":
        this.buildTrashcan(scaleFactorX, scaleFactorY, openingSize);
        console.log("trashcan receptacle created");
        break;

      case "vase":
        console.log("vase receptacle created");
        break;

      default:
        this.buildDefaultReceptacle(scaleFactorX, scaleFactorY, openingSize);
    }
  }

  buildTrashcan(scaleFactorX, scaleFactorY, openingSize) {
    const wallThickness = 5 * scaleFactorX;
    const centerX = 350 * 4 * scaleFactorX;
    const centerY = 104 * 4 * scaleFactorY;
    const halfWidth = 75 * scaleFactorX;
    const halfHeight = 95 * scaleFactorY;
    const trashcanAngle = PI / 24; // Adjust the angle as needed (15 degrees tilt in this example)

    // Define the trash can walls
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
    ];

    // Rotate wall using the trashcanAngle
    Matter.Body.rotate(walls[0], -trashcanAngle);
    Matter.Body.rotate(walls[1], trashcanAngle);

    // Add the walls to the world
    World.add(world, walls);

    // Store the wall bodies for rendering
    this.walls = walls;
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
    for (const wall of this.walls) {
      const pos = wall.position;
      const angle = wall.angle;

      push();
      translate(pos.x, pos.y);
      rotate(angle);
      rectMode(CENTER);
      strokeWeight(0);
      stroke(0, 0, 0);
      fill(0, 0, 0, 0);
      tint(0, 0, 0);
      rect(
        0,
        0,
        wall.bounds.max.x - wall.bounds.min.x,
        wall.bounds.max.y - wall.bounds.min.y
      );
      pop();
    }
  }

  checkForEntry(throwable) {
    if (throwable.body === null) return;
    const tPos = throwable.body.position;
    const bottomWallPos = this.walls[2].position;
    const bottomWallHeight = Math.abs(
      this.walls[2].bounds.max.y - this.walls[2].bounds.min.y
    );

    // Define a range around the bottom wall's top edge
    const range = bottomWallHeight / 6;

    // Check if the throwable is within the receptacle bounds and close to the bottom wall's top edge
    if (
      tPos.x > this.walls[0].position.x &&
      tPos.x < this.walls[1].position.x &&
      tPos.y > this.walls[1].position.y &&
      tPos.y < bottomWallPos.y - range
    ) {
      console.log("Throwable touched the bottom of the receptacle!");

      // Increase the score and reset the throwable
      environment.addScore(1);
      throwable.reset();
    }
  }

  destroy() {
    //World.remove(world, this.body);
    delete this;
  }
}
