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
    // const wallThickness = 5 * scaleFactorX;
    // const centerX = 350 * 4 * scaleFactorX;
    // const centerY = 104 * 4 * scaleFactorY;
    // const halfWidth = 75 * scaleFactorX;
    // const halfHeight = 95 * scaleFactorY;
    // const trashcanAngle = PI / 24; // Adjust the angle as needed (15 degrees tilt in this example)

    // // Define the trash can walls
    // const walls = [
    //   Bodies.rectangle(
    //     centerX - halfWidth,
    //     centerY,
    //     wallThickness,
    //     halfHeight * 2,
    //     {
    //       isStatic: true,
    //       label: "receptacle",
    //     }
    //   ),
    //   Bodies.rectangle(
    //     centerX + halfWidth,
    //     centerY,
    //     wallThickness,
    //     halfHeight * 2,
    //     {
    //       isStatic: true,
    //       label: "receptacle",
    //     }
    //   ),
    //   Bodies.rectangle(
    //     centerX,
    //     centerY + halfHeight,
    //     halfWidth * 2 + wallThickness,
    //     wallThickness,
    //     {
    //       isStatic: true,
    //       label: "receptacle",
    //     }
    //   ),
    // ];

    // // Rotate wall using the trashcanAngle
    // Matter.Body.rotate(walls[0], -trashcanAngle);
    // Matter.Body.rotate(walls[1], trashcanAngle);

    // // Add the walls to the world
    // World.add(world, walls);

    // // Store the wall bodies for rendering
    // this.walls = walls;
    const vertices = [
      { x: 400, y: 200 },
      { x: 300, y: 100 },
      { x: 0, y: 200 },
      { x: 200, y: 100 },
    ];
    this.thickness = 5;
    this.walls = [];
    this.wallsBounds = [];
    for(let i = 0 ; i < vertices.length - 1; i ++)
    {
      let z = this.createRectangle(vertices[i],vertices[i + 1]);
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
   
    for (let i = 0 ; i < this.walls.length; i++)
    {
      let wall = this.walls[i]
      let bound = this.wallsBounds[i];
      push();
      fill(255); // set the fill color to white
      stroke(0); // set the stroke color to black
      translate(wall.position.x, wall.position.y); // translate to the correct position after rotation
      rotate(wall.angle);
      rectMode(CENTER);
      rect(0, 0, 
        bound.x,
        bound.y);
      pop();
    }
  }
  checkForEntry(throwable) {
    return;
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
      y: (vec1.y + vec2.y) / 2
    };
    
    // Create a rectangle body using the center point, distance, and thickness
    let rect = Matter.Bodies.rectangle(center.x, center.y, distance, this.thickness, {
      isStatic: true,
      angle: angle,
    });
    // Return the rectangle body
    this.wallsBounds.push({x: distance, y:this.thickness});
    return rect;
  }

  destroy() {
    //World.remove(world, this.body);
    delete this;
  }
}
