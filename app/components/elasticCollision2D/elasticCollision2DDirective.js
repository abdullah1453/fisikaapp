angular.module('FisikaApp').directive('elasticCollDuad', function() {
	'use strict';
	//returning an element
	return {
		restrict : 'EAC',
       	replace : true,
       	transclud: true,
       	scope :{
       	},
       	link: function (scope, element, attribute) {

			//define variable
			var manifest, 
				loader,
				rocketR,
				rocketRImg,
				rocketB,
				rocketBImg,
				strokeX,
				strokeY,
				edgeX,
				edgeY,
				balls;


			var w, 
				h, 
				x, 
				y,
				distance,
				velAfterCol,
				velAfterColY,
				velAfterColX,
				degree,
				paused,
				canvas,
				Xmin,
				Xmax,
				Ymin,
				Ymax;

			drawApp();

			function drawApp() {
				// drawing app from scratch here

				//check if stage is defined
				if (scope.stage) {
					scope.stage.autoClear = true;
					scope.stage.removeAllChildren();
					scope.stage.update();
				} else {
					scope.stage = new createjs.Stage('collduad');
				}

				w = scope.stage.canvas.width;
				h = scope.stage.canvas.height;

				manifest = [
					{ src: 'space.png', id: 'space' },
					{ src: 'earth.png', id: 'earth' },
					{ src: 'rocket-red.png', id: 'Rred' },
					{ src: 'rocket-blue.png', id: 'Rblue' }
				];

				loader = new createjs.LoadQueue(true);
				loader.addEventListener('complete', handleComplete);
				loader.loadManifest(manifest, true, 'assets/img/_space/png/');
			}

			//handle Complete
			function handleComplete() {
				strokeX = new createjs.Shape();
				//Bugs: https://github.com/CreateJS/EaselJS/issues/520
				//Yes, there's a bug. If you move the .moveTo to after the .beginStroke it'll work.
				strokeX.graphics.setStrokeDash([4,2], 0).beginStroke("#cccccc").moveTo(0,h / 2).lineTo(w, h / 2);

				strokeY = new createjs.Shape();
				//Bugs: https://github.com/CreateJS/EaselJS/issues/520
				//Yes, there's a bug. If you move the .moveTo to after the .beginStroke it'll work.
				strokeY.graphics.setStrokeDash([4,2], 0).beginStroke("#cccccc").moveTo(w / 2,0).lineTo(w / 2,h);

				edgeX = new createjs.Shape();
				edgeX.graphics.setStrokeDash([4,2], 0).beginStroke('#cccccc').moveTo(50, h - 50).lineTo(w - 60, h - 50);

				Xmin = new createjs.Text("0", "14px Open Sans", "#ffffff");
				Xmin.x = 50;
				Xmin.y = h - 38;

				Xmax = new createjs.Text(w, "14px Open Sans", "#ffffff");
				Xmax.x = w - 78;
				Xmax.y = h - 38;

				edgeY = new createjs.Shape();
				edgeY.graphics.setStrokeDash([4,2], 0).beginStroke('#cccccc').moveTo(w - 50, 50).lineTo(w - 50, h - 60);

				Ymin = new createjs.Text("0", "14px Open Sans", "#ffffff");
				Ymin.x = w - 38;
				Ymin.y = 50;

				Ymax = new createjs.Text(h, "14px Open Sans", "#ffffff");
				Ymax.x = w - 38;
				Ymax.y = h - 78;

				// balls is array
				balls = [];
				balls.getRadius = function() {
					console.log(this);
				}

				balls[0] = new createjs.Shape();
				balls[0].graphics.beginFill('#f9ba46').drawCircle(0, 0, 10).endFill();
				balls[0].x = (w / 2) - ((scope.$parent.initial[0].vX / 10) * 20);
				balls[0].y = h / 2;
				balls[0].scaleX = scope.$parent.initial[0].mass / 10;
				balls[0].scaleY = scope.$parent.initial[0].mass / 10;

				balls[1] = new createjs.Shape();
				balls[1].graphics.beginFill('#2B3643').drawCircle(0, 0, 10).endFill();
				balls[1].x = w / 2;
				balls[1].y = (h / 2) - ((scope.$parent.initial[1].vY / 10) * 20);
				balls[1].scaleX = scope.$parent.initial[1].mass / 10;
				balls[1].scaleY = scope.$parent.initial[1].mass / 10;


				balls[2] = new createjs.Shape();
				balls[2].graphics.beginFill('#f35958').drawCircle(0, 0, 10).endFill();
				balls[2].x = w / 2;
				balls[2].y = 200;
				balls[2].scaleX = scope.$parent.initial[2].mass / 10;
				balls[2].scaleY = scope.$parent.initial[2].mass / 10;


				balls[3] = new createjs.Shape();
				balls[3].graphics.beginFill('#007fc0').drawCircle(0, 0, 10).endFill();
				balls[3].x = w - 150;
				balls[3].y = 200;
				balls[3].scaleX = scope.$parent.initial[3].mass / 10;
				balls[3].scaleY = scope.$parent.initial[3].mass / 10;

				//var b = new createjs.Shape();
				//b.graphics.beginFill('#888888').arc(30, 20, 20, 0, Math.PI * 2).endFill();

				//console.log(b);

				//create child
				scope.stage.addChild(edgeX, edgeY, Xmin, Xmax, Ymin, Ymax, strokeX, strokeY, rocketR, rocketB, balls[0], balls[1], balls[2], balls[3]); 
				scope.stage.update();

				createjs.Ticker.timingMode = createjs.Ticker.RAF;
				createjs.Ticker.addEventListener('tick', tick);

				createjs.Ticker.setPaused(scope.$parent.pauseTicker);

				scope.$parent.$watch('pauseTicker', function(newVal, oldVal){
					createjs.Ticker.setPaused(newVal);
				});

				scope.$parent.$watch('initial', function(newVal, oldVal){
					// watch the collection
					balls[0].scaleX = newVal[0].mass / 10;
					balls[0].scaleY = newVal[0].mass / 10;
					balls[0].mass = newVal[0].mass / 10;
					balls[0].vX = newVal[0].vX / 10;
					balls[0].vY = newVal[0].vY;
					balls[0].radius = 10 * (newVal[0].mass / 10);

					balls[1].scaleX = newVal[1].mass / 10;
					balls[1].scaleY = newVal[1].mass / 10;
					balls[1].mass = newVal[1].mass / 10;
					balls[1].vX = newVal[1].vX / 10;
					balls[1].vY = newVal[1].vY / 10;
					balls[1].radius = 10 * (newVal[1].mass / 10);

					balls[2].scaleX = newVal[2].mass / 10;
					balls[2].scaleY = newVal[2].mass / 10;
					balls[2].mass = newVal[2].mass / 10;
					balls[2].vX = newVal[2].vX / 10;
					balls[2].vY = newVal[2].vY / 10;
					balls[2].radius = 10 * (newVal[2].mass / 10);

					balls[3].scaleX = newVal[3].mass / 10;
					balls[3].scaleY = newVal[3].mass / 10;
					balls[3].mass = newVal[3].mass / 10;
					balls[3].vX = newVal[3].vX / 10;
					balls[3].vY = newVal[3].vY / 10;
					balls[3].radius = 10 * (newVal[3].mass / 10);
					
					scope.stage.update();

					scope.$parent.restartAnim = function(){
						balls[0].x = (w / 2) - ((scope.$parent.initial[0].vX / 10) * 20);
						balls[0].y = h / 2;
						balls[0].vX = newVal[0].vX / 10;
						balls[0].vY = newVal[0].vY;

						balls[1].x = w / 2;
						balls[1].y = (h / 2) - ((scope.$parent.initial[1].vY / 10) * 20);
						balls[1].vX = newVal[1].vX / 10;
						balls[1].vY = newVal[1].vY / 10;

						balls[2].x = w / 2;
						balls[2].y = 200;
						balls[2].vX = newVal[2].vX / 10;
						balls[2].vY = newVal[2].vY / 10;

						balls[3].x = w - 150;
						balls[3].y = 200;
						balls[3].vX = newVal[3].vX / 10;
						balls[3].vY = newVal[3].vY / 10;

						createjs.Ticker.setPaused(true);
						scope.$parent.pauseTicker = true;
					};
				}, true);
			}

			function tick(event) {
				//distance = (rocketR.y) - car2.x;
				if (!createjs.Ticker.getPaused()) {
					//update ball pos
					for (var i = 0; i < balls.length; i++) {
						balls[i].x += balls[i].vX;
						balls[i].y += balls[i].vY;
					};

					//Source: http://gamedev.stackexchange.com/questions/44874/given-an-angle-for-an-arrow-how-do-i-find-its-x-and-y-velocities
					wallCollision();

					//Check for collision ball
					for (var i = 0; i < balls.length; i++) {
						for (var j = 0; j < balls.length; j++) {
							if(balls[i] != balls[j]) {
								if (checkBallCollision(balls[i], balls[j])) {
									collisionResponse(balls[i], balls[j]);
								}
							}
						};
					};
				}

				scope.stage.update(event);
			}

			function wallCollision() {
				for (var i = 0; i < balls.length; i++) {
					if (balls[i].x + balls[i].radius > w || balls[i].x - balls[i].radius < 0) {
						balls[i].vX = -balls[i].vX;
						//balls[i].x += balls[i].vX;
					};

					if (balls[i].y + balls[i].radius > h || balls[i].y - balls[i].radius < 0) {
						balls[i].vY = -balls[i].vY;
						//balls[i].y += balls[i].vY; 
					};
				};
			}

			function checkBallCollision(ball1, ball2) {
				//AABBs Overlaping digunakan untuk mengecek apakah kedua bola tabrakan atau tidak.
				//prinsip dasarnya sama dengan lingkaran yang bersinggungan.
				//http://gamedevelopment.tutsplus.com/tutorials/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769
				if(ball1.x + ball1.radius + ball2.radius > ball2.x 
					&& ball1.x < ball2.x + ball1.radius + ball2.radius
					&& ball1.y + ball1.radius + ball2.radius > ball2.y 
					&& ball1.y < ball2.y + ball1.radius + ball2.radius) {
					return true;
				} else {
					return false;
				}
			}

			function collisionResponse(ball1, ball2) {
				//mencari nilai x dan y setelah terjadi tumbukan
				//https://en.wikipedia.org/wiki/Elastic_collision
				var newVelX1 = ((ball1.vX * (ball1.mass - ball2.mass)) + (2 * (ball2.mass * ball2.vX))) / (ball1.mass + ball2.mass);
				var newVelY1 = ((ball1.vY * (ball1.mass - ball2.mass)) + (2 * (ball2.mass * ball2.vY))) / (ball1.mass + ball2.mass);
				var newVelX2 = ((ball2.vX * (ball2.mass - ball1.mass)) + (2 * (ball1.mass * ball1.vX))) / (ball1.mass + ball2.mass);
				var newVelY2 = ((ball2.vY * (ball2.mass - ball1.mass)) + (2 * (ball1.mass * ball1.vY))) / (ball1.mass + ball2.mass);

				ball1.vX = newVelX1;
				ball1.vY = newVelY1;
				ball2.vX = newVelX2;
				ball2.vY = newVelY2;

				ball1.x += ball1.vX
				ball1.y += ball1.vY
				ball2.x += ball2.vX
				ball2.y += ball2.vY
			}

			function toDegree(angle) {
				return angle * (180 / Math.PI);
			}
		}
	}
});