//     file name: class.throwable.js
//        authors: Ryan Smith
//  date created: 20 Feb 2023
// date modified: 20 Feb 2023

// description: Contains an abstract base class for a throwable object, and
//              other derived classes of specific throwable objects.

// ---------------------------------------------------------- throwable: base --

class Receptacle 
{
    constructor(center, extend)
    {
      this.center = center;
      this.extend = extend;

      //0-1
      this.friction = 0;
      this.isEnter = false;
    }
    //should handle friction to return range(0, 1)
    getBounceForce()
    {
        //simple handler for testing
        //assume this.friction in range(0,1)
        return 1 - this.friction;
    }

    // return true if the ball score
    OnCollisionEnter(ball)
    {
        //Enter From Left
        let score = false;
        let enterLeft = (ball.pos.x + ball.getRadius() < this.center.x + this.extend.x && ball.pos.x + ball.getRadius() >= this.center.x - this.extend.x);
        let enterRight = (ball.pos.x - ball.getRadius() > this.center.x - this.extend.x && ball.pos.x - ball.getRadius() <= this.center.x + this.extend.x);
        let enterTop = (ball.pos.y + ball.getRadius() < this.center.y + this.extend.y && ball.pos.y + ball.getRadius() >= this.center.y - this.extend.y);
        let enterBottom = (ball.pos.y - ball.getRadius()> this.center.y - this.extend.y && ball.pos.y - ball.getRadius() <= this.center.y + this.extend.y);

        //If Collision detected
        if((enterLeft || enterRight) && (enterTop|| enterBottom))
        {
            //if the ball is not inside the receptacle
            if(!this.isEnter)
            {
                let vec = createVector(this.center.x - ball.pos.x, this.center.y - ball.pos.y);
                let degree = degrees(atan2(vec.y, vec.x));

                //calculate the angle of the line from the center of the retangle to the upper left corner
                let upperLeftAngle = degrees(atan2(this.extend.y, this.extend.x));

                //calculate the angle of the line from center of the rectangle to the upper right coner
                let upperRightAngle = 180 - upperLeftAngle;
                // Check if the resulting angle falls within the range of the upper surface of the retangle
                if (degree > upperLeftAngle && degree < upperRightAngle) {
                    score = true;
                    this.isEnter = true;
                }

                //if collide on the side and bottom => bounce back
                else
                {
                    
                    //if collide at bottom => flip vertically
                    if(ball.pos.y > this.center.y + this.extend.y)
                    {
                        ball.vel.y *= -1 *this.getBounceForce();
                        
                    }
                    //if collide at side => flip horizontally
                    else
                    {
                        ball.vel.x *= -1 * this.getBounceForce();
                    }
                }
            }
            
        }
        // if collision not detected => not collide => set isenter = false
        else 
        {
            this.isEnter = false;
        }
        return score;
    }
    show() {
      push();
      
      stroke(255);
      strokeWeight(2);
      if (this.isEnter) 
      {
        fill(255, 50);
      } 
      else
      {
        fill(255, 150);
      }
      
      rect(this.center.x - this.extend.x, this.center.y - this.extend.y, this.extend.x*2,this.extend.y*2);
      strokeWeight(4);
      pop();
    }
    //return true if the ball score
    update(ball)
    {
        return this.OnCollisionEnter(ball);
    }
    
  

  }
  //value > max? value = max: value
  //value < min? value = min: value
  function clamp(val, minVal, maxVal) {
    return min(max(val, minVal), maxVal);
  }