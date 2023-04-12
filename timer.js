function init(paths) {
    let startTime;
    let gameDuration = 5; // game duration in seconds
    let timerInterval;
  
    function startGame() {
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    }
  
    function updateTimer() {
      let elapsedTime = (Date.now() - startTime) / 1000;
      let timeRemaining = gameDuration - elapsedTime;
  
      // check if time has run out
      if (timeRemaining <= 0) {
        console.log("Time's up!");
        clearInterval(timerInterval);
        timeRemaining = 0; // set timeRemaining to 0 to avoid negative values
        displayTimeUpMessage();
      }
  
      // update timer display
      let timerElement = document.querySelector(".time");
      timerElement.textContent = "Time: " + timeRemaining.toFixed(0) + "s";
    }
  
    function displayTimeUpMessage() {
      let messageElement = document.createElement("h1");
      messageElement.textContent = "TIME'S UP!";
      messageElement.style.position = "absolute";
      messageElement.style.top = "50%";
      messageElement.style.left = "50%";
      messageElement.style.transform = "translate(-50%, -50%)";
      messageElement.style.color = "red";
      messageElement.style.textAlign = "center";
      messageElement.style.fontSize = "72px";
      document.body.appendChild(messageElement);
    }
  
    // load additional scripts
    for (let path of paths) {
      let script = document.createElement("script");
      script.src = path;
      document.head.appendChild(script);
    }
  
    startGame();
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    let paths = [
      "../../../modules/p5.min.js",
      "../../../modules/class.throwable.js",
      "../../../modules/class.receptacle.js",
      "../../../modules/menu.js"
    ];
    init(paths);
  });
  