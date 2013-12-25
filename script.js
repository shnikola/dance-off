document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    checkJopaControls(e.keyCode);
}

var frameWidth = 236;

var jopaState = [0, 0];
var jopaFrames = [[0], [1, 2, 3, 2], [4, 5], [6, 7], [8, 9], [10, 11, 12, 11], 
                  [13, 14], [15, 16, 17, 16], [18, 19], [21, 20], [22, 23], [24, 25], [26, 27]];
                  
var asjaState = [0, 0];
var asjaFrames = [];

$(function() {
  var $jopa = $("#jopa");
  var $asja = $("#asja");
  
  var frameInterval = setInterval(function() {
    setFrame("jopa", $jopa, jopaState, jopaFrames);
    //setFrame("asja", $asja, asjaState, asjaFrames);
  }, 50);
  
  var animateInterval = setInterval(function() {
    jopaState = giveOompf(jopaState);
    //asjaState = giveOompf(asjaState);
  }, 300);
  
});

function setFrame(name, $player, state, frames) {
  var frameset = frames[state[0]];
  state[1] = state[1] % frameset.length;
  var frame = frameset[state[1]];
  $player.css('background-position', -frameWidth * frame + "px 0px");
}

function giveOompf(state, frame) {
  state[1] = state[1] + 1
  return state;
}

function checkJopaControls(key) {
  // Svatka tipka ciklira između 3 različita poteza
  /* w */ if (key == '87')      { jopaState[0] = jopaState[0] % 3 + 1}
  /* a */ else if (key == '65') { jopaState[0] = jopaState[0] % 3 + 4}
  /* s */ else if (key == '83') { jopaState[0] = jopaState[0] % 3 + 7}
  /* d */ else if (key == '68') { jopaState[0] = jopaState[0] % 3 + 10}
  console.log(jopaState[0])
}

function checkJopaControls2(key) {
  /* w */ if (key == '87')      { jopaState[0] = jopaState[0] % 12 + 1}
  /* s */ else if (key == '83') { jopaState[0] = (jopaState[0] + 11) % 12}
  /* a */ else if (key == '65') { jopaState[1] += 1 }
  /* d */ else if (key == '68') { jopaState[1] += 1 }
}



