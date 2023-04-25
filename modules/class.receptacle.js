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

    const openingSize = 50; // Adjust the size of the opening as needed
    switch (receptacleType) {
      case "goblet":
        break;

      case "net":
        break;

      case "trashcan":
        break;

      case "vase":
        break;

      default:
        const wallThickness = 10;
        const centerX = width / 2;
        const centerY = height / 2;
        const halfWidth = 100;
        const halfHeight = 100;

        // Define the receptacle walls
        const leftWall = Bodies.rectangle(
          centerX - halfWidth,
          centerY,
          wallThickness,
          halfHeight * 2,
          { isStatic: true, label: "receptacle" }
        );
        const rightWall = Bodies.rectangle(
          centerX + halfWidth,
          centerY,
          wallThickness,
          halfHeight * 2,
          { isStatic: true, label: "receptacle" }
        );
        const bottomWall = Bodies.rectangle(
          centerX,
          centerY + halfHeight,
          halfWidth * 2 + wallThickness,
          wallThickness,
          { isStatic: true, label: "receptacle" }
        );
        const topLeftWall = Bodies.rectangle(
          centerX - halfWidth + openingSize / 2,
          centerY - halfHeight,
          openingSize / 2,
          wallThickness,
          { isStatic: true, label: "receptacle" }
        );
        const topRightWall = Bodies.rectangle(
          centerX + halfWidth - openingSize / 2,
          centerY - halfHeight,
          openingSize / 2,
          wallThickness,
          { isStatic: true, label: "receptacle" }
        );

        // Add the walls to the world
        World.add(world, [
          leftWall,
          rightWall,
          bottomWall,
          topLeftWall,
          topRightWall,
        ]);

        // Store the wall bodies for rendering
        this.walls = [
          leftWall,
          rightWall,
          bottomWall,
          topLeftWall,
          topRightWall,
        ];
    }
  }

  display() {
    for (const wall of this.walls) {
      const pos = wall.position;
      const angle = wall.angle;

      push();
      translate(pos.x, pos.y);
      rotate(angle);
      rectMode(CENTER);
      strokeWeight(3);
      stroke(0, 255, 0);
      fill(0, 255, 0, 100);
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
      tPos.y > this.walls[3].position.y &&
      tPos.y < bottomWallPos.y - range
    ) {
      console.log("Throwable touched the bottom of the receptacle!");

      // Increase the score and reset the throwable
      environment.addScore(1);
      environment.checkScore();
      throwable.reset();
    }
  }
}
