let canvas = document.getElementById('can');
let ctx = canvas.getContext('2d');

console.log('draw');

var WIDTH = canvas.offsetWidth;
var HEIGHT = canvas.offsetHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

function circleFactory(x, y) {
	var circle = {x, y};
	circle.draw = draw.bind(circle);
	return circle;
}

var RAD = 5;

function draw() {
	ctx.beginPath();
	ctx.arc(this.x, this.y, RAD, Math.PI * 2, 0);
	ctx.fill();
}

var COL = 'rgba(255, 255, 255, 0.5)';
ctx.fillStyle = COL;
ctx.strokeStyle = COL;

var dots = [];

for(var i = 0; i < 50; i++) {
	var x = 10 + Math.random() * (WIDTH - 20);
	var y = 10 + Math.random() * (HEIGHT - 20);

	var v = {y: Math.random() * 0.5, x: Math.random() * 0.5};
	
	var circle = circleFactory(x, y);

	circle.v = v;

	dots.push(circle);
}

var A = setInterval(() => {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);

	for(dot of dots) {
		dot.x += dot.v.x;
		dot.y += dot.v.y;

		var candidates = [];

		for(dit of dots) {
			let dist = Math.sqrt(Math.pow(dit.x - dot.x, 2) + Math.pow(dit.y - dot.y, 2));
			candidates.push({dist, a: dit});
		}


		candidates.sort( (a, b) => a.dist - b.dist ).slice(0, 4).forEach(m => {
			ctx.beginPath();
			ctx.moveTo(dot.x, dot.y);
			ctx.lineTo(m.a.x, m.a.y);
			ctx.stroke();
		});

		if((dot.x + RAD) >= WIDTH) {
			dot.v.x = -dot.v.x;
		}

		if( (dot.x - RAD) <= 0) {
			dot.v.x = - dot.v.x;
		}

		if( (dot.y + RAD) >= HEIGHT) {
			dot.v.y = -dot.v.y;
		}

		if( (dot.y - RAD) <= 0) {
			dot.v.y = -dot.v.y;
		}

		dot.draw();
	}
}, 1);

