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
      this.isEnter = false;
    }
    OnCollisionEnter(ball)
    {
        //Enter From Left
        let score = false;
        let enterLeft = (ball.pos.x + ball.getRadius() < this.center.x + this.extend.x && ball.pos.x + ball.getRadius() >= this.center.x - this.extend.x);
        let enterRight = (ball.pos.x - ball.getRadius() > this.center.x - this.extend.x && ball.pos.x - ball.getRadius() <= this.center.x + this.extend.x);
        let enterTop = (ball.pos.y + ball.getRadius() < this.center.y + this.extend.y && ball.pos.y + ball.getRadius() >= this.center.y - this.extend.y);
        let enterBottom = (ball.pos.y - ball.getRadius()> this.center.y - this.extend.y && ball.pos.y - ball.getRadius() <= this.center.y + this.extend.y);


        if((enterLeft || enterRight) && (enterTop|| enterBottom))
        {
            if(!this.isEnter)
            {
                let vec = createVector(this.center.x - ball.pos.x, this.center.y - ball.pos.y);
                let degree = degrees(atan2(vec.y, vec.x));
                //if ball hit top surface=> score
                if(degree > 45 && degree < 135)
                {
                    if(!this.isEnter)
                    {
                        score = true;
                        this.isEnter = true;
                    }
                }
                else
                {
                    
                    
                    if(ball.pos.y > this.center.y + this.extend.y)
                    {
                        ball.vel.y *= -0.95;
                    }
                    else
                    {
                        ball.vel.x *= -0.95;
                    }
                }
            }
            
        }
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
    update(ball)
    {
        this.OnCollisionEnter(ball);
    }
    
  

  }
  