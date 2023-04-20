//     file name: class.popup.js
//       authors: Nathan Fleet
//  date created: 20 Apr 2023
// date modified: 

// description: Class for popup which should appear when:
//                  - Timer runs out
//                  - Target score is reached


// this could likely be implemented in update() Environment class
class Popup {
    constructor(x, y, width, height, message) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.message = message;
        this.visible = false;
    }

    display() {
        if(this.visible) {
            push();
            rectMode(CENTER);
            fill(255, 255, 255);
            rect(this.x, this.y, this.width, this.height);
            textSize(32);
            fill(0, 0, 0);
            textAlign(CENTER, CENTER);
            text(this.message, this.x, this.y);
            pop();
        }
    }

    hide() {
        this.visible = false;
    }
}