var frameWidth = 236;
var taskMin = 5000;
var taskMax = 6000;

var sounds = {
  coin: new Audio("http://www.basementarcade.com/arcade/sounds/domman/coin%20up.wav")
}

var jopa = {
  name: "Jopa",
  task: null,
  state: ["idle", 0, 0],
  frames: {
    "idle": [[0]],
    "left": [[1, 2, 3, 2], [4, 5], [6, 7]],
    "right":[[8, 9], [10, 11, 12, 11], [13, 14]],
    "up":   [[15, 16, 17, 16], [18, 19], [21, 20]],
    "down": [[22, 23], [24, 25], [26, 27]]
  },
  controls: {"38": "up", "37": 'left', "40": 'down', "39": 'right'},
  area: function() { return $("#jopa"); },
  sprite: function() { return $("#jopa .player"); }
};

var asja = {
  name: "Asja",
  task: null,
  state: ["idle", 0, 0],
  frames: {
    "idle": [[0, 2]],
    "left": [[1, 3], [1, 3, 4, 5]], 
    "right":[[1, 3, 6, 7], [6, 7, 8]],
    "up":   [[9, 10], [11, 12]],
    "down": [[12, 13, 12, 14], [15, 16]]
  },
  controls: {"87": "up", "65": 'left', "83": 'down', "68": 'right'},
  area: function() { return $("#asja"); },
  sprite: function() { return $("#asja .player"); }
};

$(function() {
  titleScreen();
  //gameScreen();
});

function titleScreen() {
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
    startCountdown(3);
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
  var countdown = count;
  var countdownInterval = setInterval(function() {
    if (countdown < 0) { 
      $("#countdown").hide();
      clearInterval(countdownInterval); 
      startGame();
    } else {
      $("#countdown").html(countdown || "Dance!");
      countdown--;
    }
  }, 1000);
}

function startGame() {
  document.onkeydown = checkKey;
  
  var frameInterval = setInterval(function() {
    setFrame(jopa);
    setFrame(asja);
  }, 50);
  
  var animateInterval = setInterval(giveOompf, 300);
  generateTask(jopa);
  generateTask(asja);
}

function setFrame(player) {
  var frameGroup = player.frames[player.state[0]];
  player.state[1] = player.state[1] % frameGroup.length;
  var frameset = frameGroup[player.state[1]];
  player.state[2] = player.state[2] % frameset.length;
  var frame = frameset[player.state[2]];
  player.sprite().css('background-position', -frameWidth * frame + "px 0px");
}

function giveOompf(player) {
  jopa.state[2] = jopa.state[2] + 1;
  asja.state[2] = asja.state[2] + 1;
}

function generateTask(player) {
  var task = ["left", "up", "down", "right"][Math.floor(Math.random() * 4)];
  player.task = task;
  player.area().find(".task").removeClass("true false").html(task);
  setTimeout(function() { generateTask(player); }, Math.random() * (taskMax - taskMin) + taskMin);
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
    player.task = null;
  }
    
   
  // Svatka tipka ciklira između grupe različitih poteza
  
}


