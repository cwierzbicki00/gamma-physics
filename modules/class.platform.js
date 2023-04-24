class Platform {
  constructor(center, w, h, rotation) {
    let option = {
      isStatic: true,
      angle: rotation,
    };
    this.width = w;
    this.height = h;
    this.body = Bodies.rectangle(
      center.x,
      center.y,
      this.width,
      this.height,
      option
    );
    World.add(world, this.body);
  }
  display(environment) {
    push();
    fill(255); // set the fill color to white
    stroke(0); // set the stroke color to black
    translate(this.body.position.x, this.body.position.y); // translate to the correct position after rotation
    rotate(this.body.angle);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    pop();
  }

  destroy() {
    //World.remove(world, this.body);
    delete this;
  }
}
