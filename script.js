var game = {
  interacting: false,
  animating: false,
  animationInterval: 320,
  backgroundInterval: 1000,
  taskLength: [3000, 4000],
  taskDifficulty: 0,
  randomTaskLength: function() {
    return Math.random() * (this.taskLength[1] - this.taskLength[0]) + this.taskLength[0];
  },
  reset: function() {
    this.animationInterval = 320;
    this.backgroundInterval = 1000;

    this.taskLength = [3000, 4000];
    this.taskDifficulty = 0;
  }
};

var sounds = {
  coin: new Audio("http://www.basementarcade.com/arcade/sounds/domman/coin%20up.wav"),
  music: new Audio("tune1.mp3"),
  bonus: new Audio("http://themushroomkingdom.net/sounds/wav/smb/smb_flagpole.wav"),
  point: new Audio("http://themushroomkingdom.net/sounds/wav/smb/smb_coin.wav"),
  win: new Audio("http://themushroomkingdom.net/sounds/wav/smb/smb_world_clear.wav")
};

var jopa = {
  name: "Jopa",
  task: null,
  points: 0,
  state: ["idle", 0, 0],
  frames: {
    "idle": [[0, 1]],
    "left": [[2, 3, 4, 3], [5, 6], [7, 8]],
    "right":[[9, 10], [11, 12, 13, 12], [14, 15]],
    "up":   [[16, 17, 18, 17], [19, 20], [22, 21]],
    "down": [[23, 24], [25, 26], [27, 28]],
    "end":  [[29, 30, 31, 32, 33, 34]]
  },
  frameWidth: 236,
  controls: {"38": "up", "37": 'left', "40": 'down', "39": 'right'},
  area: function() { return $("#jopa"); },
  sprite: function() { return $("#jopa .player"); },
};

var asja = {
  name: "Asja",
  task: null,
  points: 0,
  state: ["idle", 0, 0],
  frames: {
    "idle": [[0, 2]],
    "left": [[1, 3], [6, 7, 8]], 
    "right":[[1, 3, 6, 7], [1, 3, 4, 5]],
    "up":   [[11, 12], [15, 16]],
    "down": [[12, 13, 12, 14], [9, 10]],
    "end":  [[17]]
  },
  frameWidth: 236,
  controls: {"87": "up", "65": 'left', "83": 'down', "68": 'right'},
  area: function() { return $("#asja"); },
  sprite: function() { return $("#asja .player"); }
};


// ======================== Game Setup ========================

$(function() {
  titleScreen();
  //gameScreen();
});

function titleScreen() {
  sounds["music"].addEventListener('canplaythrough', function() {
    $("#loading").hide();
    $("#start-game").show();
  });
  
  $("#title-screen").show();  
  
  $("#start-game").click(function() {
    sounds["coin"].play();
    $("#title-screen").fadeOut(1000, gameScreen);
  });
}

function gameScreen() {
  $("#game-screen").show();
  $(".player-area .name").removeClass("hidden");
  
  showWithFlicker([asja.sprite(), jopa.sprite()], 7, function() {
    sounds["music"].play();
    startCountdown(5);
    $(".player-area .controls").removeClass("hidden");
  });
}

function showWithFlicker($elements, count, onSuccess) {
  if (count <= 0) { $elements.shift(); count = 7;}
  if ($elements.length == 0) { return onSuccess(); }
  
  var $element = $elements[0];
  setTimeout(function() { 
    $element.toggleClass("hidden");
    showWithFlicker($elements, count - 1, onSuccess)
  }, Math.random() * count * 100);
}

function startCountdown(count) {
  $("#countdown").html("").removeClass("hidden")  
  var countdown = count;
  var countdownInterval = setInterval(function() {
    if (countdown < 0) { 
      $("#countdown").addClass("hidden");
      clearInterval(countdownInterval); 
      startGame();
    } else {
      $("#countdown").html(countdown || "Dance!");
      countdown--;
    }
  }, 1000);
}


// ======================== Game Play ========================


function startGame() {
  game.interacting = true;
  game.animating = true;
  document.onkeydown = checkKey;
  $(".player-area .controls").addClass("hidden");
  $(".player-area .points").removeClass("hidden");
  
  setFrame(jopa);
  setFrame(asja);
  animate();

  generateTask(jopa);
  generateTask(asja);
  setHardening();

  setTimeout(endGame, 115000);
}

function setFrame(player) {
  var frameGroup = player.frames[player.state[0]];
  player.state[1] = player.state[1] % frameGroup.length;
  var frameset = frameGroup[player.state[1]];
  player.state[2] = player.state[2] % frameset.length;
  var frame = frameset[player.state[2]];
  player.sprite().css('background-position', -player.frameWidth * frame + "px 0px");
  if (game.animating) setTimeout(function() { setFrame(player); }, 40);
}

function animate() {
  jopa.state[2] = jopa.state[2] + 1;
  asja.state[2] = asja.state[2] + 1;
  if (game.animating) setTimeout(function() { animate(); }, game.animationInterval);
}

function generateTask(player) {
  var task = ["left", "up", "down", "right"][Math.floor(Math.random() * 4)];
  player.task = task;
  player.area().find(".task").removeClass("hidden true false").html(task);
  if (game.taskDifficulty >= 1) {
    var taskPos = ["left", "right", "center", "bottom"][Math.floor(Math.random() * 4)];
    player.area().find(".task").toggleClass(taskPos);
  }
  if (game.interacting) {
    setTimeout(function() { generateTask(player); }, game.randomTaskLength());
  } else {
    $(".player-area .task").addClass("hidden").removeClass("left right center bottom");
  }
}

function setHardening() {
  // Speed up tasks every 7 seconds
  var speedupInterval = setInterval(function() {
    if (game.interacting) {
      game.taskLength[0] = Math.max(200, game.taskLength[0] - 300);
      game.taskLength[1] = Math.max(600, game.taskLength[1] - 300);
      game.animationInterval = Math.max(60, game.animationInterval - 20);
    } else {
      clearInterval(speedupInterval);
    }
  }, 7000);
  
  // Change background color
  setTimeout(changeBackground, 32000);
  
  // Make tasks moveable  
  setTimeout(function() { game.taskDifficulty = 1 }, 54000);
  
  // Throw Confetti
  setTimeout(startConfetti, 77000);
  
  // Speed up background
  setTimeout(function() { game.backgroundInterval = 100; }, 77000);
  

}

function changeBackground() {
  $("html").css("background-color", randomColor());
  if (game.interacting) setTimeout(changeBackground, game.backgroundInterval);
}

function randomColor() {
  var color = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
  var mixColor = [255, 255, 255];
  for (var i = 0; i < 3; i++) { color[i] = Math.floor((color[i] + mixColor[i]) / 2); }
  return "rgb(" + color.join(",") + ")";
}

function checkKey(e) {
  e = e || window.event;
  checkControls(jopa, e.keyCode);
  checkControls(asja, e.keyCode);
}

function checkControls(player, key) {
  var playerDirection = player.controls[key];
  if (playerDirection == null) return;
  
  player.state[0] = playerDirection;
  player.state[1] = player.state[1] + 1;
  
  if (player.task) {
    var correct = (playerDirection == player.task);
    player.area().find(".task").addClass(correct ? "true" : "false");
    if (correct) addPoints(player, 50);
    player.task = null;
  }
}

function addPoints(player, points) {
  var from = {points: player.points};
  var to = {points: player.points + points};
  var $points = player.area().find(".points");
  $(from).animate(to, {
    duration: 500,
    step: function() { $points.html(Math.round(this.points)); }
  });
  player.points = player.points + points;
}


// ======================== Game End ========================


function endGame() {
  game.interacting = false;
  game.animationInterval = 320;
  $("#game-over").html("Time's up!").removeClass("hidden");
  document.onkeydown = null;
  jopa.state = ["idle", 0, 0]; 
  asja.state = ["idle", 0, 0];
  if (jopa.points >= asja.points) {
    setTimeout(birthdayBonus, 5000);
    setTimeout(showWinner, 10000);
  } else {
    setTimeout(showWinner, 5000);
  }
}

function birthdayBonus() {
  asja.area().append("<div class='bonus'>Birthday bonus!</div>");
  sounds["bonus"].play();
  asja.area().find(".bonus").animate({bottom: 90}, 1000, "linear").animate({opacity: 0}, 1000, "swing");
  addPoints(asja, jopa.points - asja.points + 1)
  setTimeout(function() { sounds["point"].play(); }, 2000);
}

function showWinner() {
  $("#game-over").html("Asja wins!").removeClass("hidden");
  jopa.state = ["end", 0, 0];
  asja.state = ["end", 0, 0];
  asja.area().addClass("winning");
  sounds["win"].play();
  setTimeout(function() { 
    showWithFlicker([$("#play-again")], 7, function() {
      $("#play-again").one("click", restartGame);
    });
  }, 8000);
}

function restartGame() {
  game.reset();
  game.animating = false;
  jopa.state = ["idle", 0, 0];
  asja.state = ["idle", 0, 0];
  $("#game-over, #play-again").addClass("hidden");
  $(".player, .name, .controls").addClass("hidden");
  $(".player-area").removeClass("winning");
  jopa.points = asja.points = 0;
  $(".points").addClass("hidden").html("0");
  $("html").css("background-color", "#373337");
  stopConfetti();
  gameScreen();
}
