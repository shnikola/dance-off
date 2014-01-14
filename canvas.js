var canvas = {}

function initCanvas() {
  canvas.element = document.getElementById("canvas");
  canvas.ctx = canvas.element.getContext("2d");
	canvas.W = window.innerWidth;
	canvas.H = window.innerHeight;
	canvas.element.width = canvas.W;
	canvas.element.height = canvas.H;
  canvas.max_particles = 100;
  canvas.particles = [];
  canvas.angle = 0;
  
	for (var i = 0; i < canvas.max_particles; i++) {
		canvas.particles.push({
			x: Math.random() * canvas.W, //x-coordinate
			y: Math.random() * canvas.H, //y-coordinate
			r: Math.random() * 4 + 1, //radius
			d: Math.random() * canvas.max_particles, //density
      color: "rgba(" + Math.floor((Math.random() * 255)) +", " + Math.floor((Math.random() * 255)) +", " + Math.floor((Math.random() * 255)) + ", 0.8)"});
	}
}

function drawCanvas() {
	canvas.ctx.clearRect(0, 0, canvas.W, canvas.H);
	for (var i = 0; i < canvas.max_particles; i++) { 
		var p = canvas.particles[i];
    canvas.ctx.beginPath();
    canvas.ctx.fillStyle = p.color;
		canvas.ctx.fillRect(p.x, p.y, 6, 6);
    canvas.ctx.fill();
	}
	
	updateParticles();
}

//Function to move the snowflakes
//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
function updateParticles() {
	canvas.angle += 0.01;
	for (var i = 0; i < canvas.max_particles; i++) {
		var p = canvas.particles[i];
		//Updating X and Y coordinates
		//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
		//Every particle has its own density which can be used to make the downward movement different for each flake
		//Lets make it more random by adding in the radius
		p.y += 2 * (Math.cos(canvas.angle+p.d) + 1 + p.r/2);
		p.x += Math.sin(canvas.angle) * 2;
		
		//Sending flakes back from the top when it exits
		//Lets make it a bit more organic and let flakes enter from the left and right also.
		if (p.x > canvas.W+5 || p.x < -5 || p.y > canvas.H) {
			if (i % 3 > 0) { //66.67% of the flakes
        canvas.particles[i] = {x: Math.random() * canvas.W, y: -10, r: p.r, d: p.d, color : p.color};
			} else if (Math.sin(canvas.angle) > 0) {
				//Enter from the left
        canvas.particles[i] = {x: -5, y: Math.random() * canvas.H, r: p.r, d: p.d, color: p.color};
			} else {
				//Enter from the right
        canvas.particles[i] = {x: canvas.W + 5, y: Math.random() * canvas.H, r: p.r, d: p.d, color : p.color};
			}
		}
	}
}

function startConfetti() {
  initCanvas();
  canvas.animationInterval = setInterval(drawCanvas, 33);
}

function stopConfetti() {
	canvas.ctx.clearRect(0, 0, canvas.W, canvas.H);
  clearInterval(canvas.animationInterval);
}
