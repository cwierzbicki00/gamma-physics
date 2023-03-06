//     file name: class.receptacle.js
//        authors: Quoc, Ryan Smith
//  date created: 02 Mar 2023
// date modified: 06 Mar 2023

// description: Contains a base class for a receptacle object, which is
//              intended to be a target for the player to toss the throwable
//              at.


class Receptacle {
// --------------------------------------------------------------------- ctor --
    constructor(center, extend) {

      // size parameters for the receptacle
      this.center = center; // an (x, y) coordinate relative to windowSize
      this.extend = extend; // an (x, y) coordinate relative to center

      this.friction = 0; // range: 0-1
      this.isEnter = false;
    }

    // should handle friction to return range(0, 1)
    getBounceForce() {
        // simple handler for testing
        // assume this.friction in range(0,1)
        return 1 - this.friction;
    }

    // return true if the ball score
    OnCollisionEnter(ball) {
        // TODO: correct ball not staying in receptacle once entered
        // enter from left
        let score = false;
        let enterLeft = (ball.pos.x + ball.getRadius() < this.center.x + this.extend.x &&
                         ball.pos.x + ball.getRadius() >= this.center.x - this.extend.x);
        let enterRight = (ball.pos.x - ball.getRadius() > this.center.x - this.extend.x &&
                          ball.pos.x - ball.getRadius() <= this.center.x + this.extend.x);
        let enterTop = (ball.pos.y + ball.getRadius() < this.center.y + this.extend.y &&
                        ball.pos.y + ball.getRadius() >= this.center.y - this.extend.y);
        let enterBottom = (ball.pos.y - ball.getRadius()> this.center.y - this.extend.y &&
                           ball.pos.y - ball.getRadius() <= this.center.y + this.extend.y);

        // if collision detected
        if ((enterLeft || enterRight) && (enterTop || enterBottom)) {
            // if the ball is not inside the receptacle
            if (!this.isEnter) {
                let vec = createVector(this.center.x - ball.pos.x, this.center.y - ball.pos.y);
                let degree = degrees(atan2(vec.y, vec.x));

                // calculate the angle of the line from the center of the rectangle to the upper left corner
                let upperLeftAngle = degrees(atan2(this.extend.y, this.extend.x));

                // calculate the angle of the line from center of the rectangle to the upper right corner
                let upperRightAngle = 180 - upperLeftAngle;

                // check if the resulting angle falls within the range of the upper surface of the rectangle
                if (degree > upperLeftAngle && degree < upperRightAngle) {
                    score = true;
                    this.isEnter = true;
                }

                // if collide on the side and bottom => bounce back
                else {
                    
                    // if collide at bottom => flip vertically
                    if(ball.pos.y > this.center.y + this.extend.y) {
                        ball.vel.y *= -1 * this.getBounceForce();
                        
                    }

                    // if collide at side => flip horizontally
                    else {
                        ball.vel.x *= -1 * this.getBounceForce();
                    }
                }
            }
            
        }
        // if collision not detected => not collide => set isEnter = false
        else {
            this.isEnter = false;
        }
        return score;
    }

    show() {
      push();

      // color parameters for the receptacle
      stroke(255);
      strokeWeight(2);
      if (this.isEnter) {
        fill(255, 50);
      } 
      else {
        fill(255, 150);
      }

      rect(this.center.x - this.extend.x, this.center.y - this.extend.y,
          this.extend.x * 2,this.extend.y * 2);
      strokeWeight(4);
      pop();
    }

    update(ball) {
        // return true if the ball score
        return this.OnCollisionEnter(ball);
    }
  }

  // value > max? value = max: value
  // value < min? value = min: value
  function clamp(val, minVal, maxVal) {
    return min(max(val, minVal), maxVal);
  }