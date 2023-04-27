// VertexCollider class
class VertexCollider {
  constructor(vertices, scaleFactorX, scaleFactorY) {
    this.vertices = vertices.map((vertex) => {
      return { x: vertex.x * scaleFactorX, y: vertex.y * scaleFactorY };
    });
    this.bodies = [];
    this.bounds = [];
    this.thickness = 5;

    // Create walls for each pair of vertices
    for (let i = 0; i < this.vertices.length - 1; i++) {
      let body = this.createRectangle(this.vertices[i], this.vertices[i + 1]);
      this.bodies.push(body);
    }

    console.log("Made a vertex collider");

    // Add the collider walls to the Matter.js world
    World.add(engine.world, this.bodies);
  }

  display() {
    for (let i = 0; i < this.bodies.length; i++) {
      let body = this.bodies[i];
      let bound = this.bounds[i];

      push();
      fill(0, 0); //set to transparent
      stroke(0, 0); // set the stroke color to black
      translate(body.position.x, body.position.y); // translate to the correct position after rotation
      rotate(body.angle);

      rectMode(CENTER);
      rect(0, 0, bound.x, bound.y);
      pop();
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
    this.bounds.push({ x: distance, y: this.thickness });
    return rect;
  }

  destroy() {
    for (let body of this.bodies) {
      World.remove(engine.world, body);
    }
    delete this;
  }
}
