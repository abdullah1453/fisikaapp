angular.module('FisikaApp').directive('inelasticCollDuad', function() {
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
			var space,
				spaceImg,
				manifest, 
				loader,
				earth,
				earthImg,
				rocketR,
				rocketRImg,
				rocketB,
				rocketBImg,
				strokeX,
				strokeY;


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
				canvas;

			drawApp();

			function drawApp() {
				// drawing app from scratch here

				//check if stage is defined
				if (scope.stage) {
					scope.stage.autoClear = true;
					scope.stage.removeAllChildren();
					scope.stage.update();
				} else {
					scope.stage = new createjs.Stage('incollduad');
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
				space = new createjs.Shape();
				spaceImg = loader.getResult('space');
				space.graphics.beginBitmapFill(spaceImg).drawRect(0, 0, w, h);

				earth = new createjs.Shape();
				earthImg = loader.getResult('earth');
				earth.graphics.beginBitmapFill(earthImg).drawRect(0, 0, 480, 438);
				earth.x = (w / 2) - (earthImg.width / 2);
				earth.y = (h / 2) - (earthImg.height / 2);

				rocketR = new createjs.Shape();
				rocketRImg = loader.getResult('Rred');
				rocketR.graphics.beginBitmapFill(rocketRImg).drawRect(0, 0, rocketRImg.width, rocketRImg.height);
				rocketR.x = w / 2;
				rocketR.y = (h / 2) + ((scope.$parent.initial.rocketRVell / 10) * 20);
				rocketR.regX = rocketRImg.width / 2;
				//rocketR.radius = rocketRImg.width / 2;

				rocketB = new createjs.Shape();
				rocketBImg = loader.getResult('Rblue');
				rocketB.graphics.beginBitmapFill(rocketBImg).drawRect(0, 0, rocketBImg.width, rocketBImg.height);
				rocketB.x = (w / 2) - ((scope.$parent.initial.rocketBVell / 10) * 20);
				rocketB.y = h / 2;
				rocketB.regX = rocketBImg.width;
				rocketB.regY = rocketBImg.height / 2;
				//rocketB.radius = rocketBImg.height / 2;

				strokeX = new createjs.Shape();
				//Bugs: https://github.com/CreateJS/EaselJS/issues/520
				//Yes, there's a bug. If you move the .moveTo to after the .beginStroke it'll work.
				strokeX.graphics.setStrokeDash([4,2], 0).beginStroke("#cccccc").moveTo(0,h / 2).lineTo(w, h / 2);

				strokeY = new createjs.Shape();
				//Bugs: https://github.com/CreateJS/EaselJS/issues/520
				//Yes, there's a bug. If you move the .moveTo to after the .beginStroke it'll work.
				strokeY.graphics.setStrokeDash([4,2], 0).beginStroke("#cccccc").moveTo(w / 2,0).lineTo(w / 2,h);

				//create child
				scope.stage.addChild(space, earth, strokeX, strokeY, rocketR, rocketB); 
				scope.stage.update();

				createjs.Ticker.timingMode = createjs.Ticker.RAF;
				createjs.Ticker.addEventListener('tick', tick);

				createjs.Ticker.setPaused(scope.$parent.pauseTicker);

				scope.$parent.$watch('pauseTicker', function(newVal, oldVal){
					createjs.Ticker.setPaused(newVal);
				});

				scope.$parent.$watchCollection('initial', function(newVal, oldVal){
					// watch the collection
					rocketR.mass = newVal.rocketRMass;
					rocketR.vel = newVal.rocketRVell / 10;
					rocketB.mass = newVal.rocketBMass;
					rocketB.vel = newVal.rocketBVell / 10;
					rocketB.x = (w / 2) - ((newVal.rocketBVell / 10) * 20);
					rocketR.y = (h / 2) + ((newVal.rocketRVell / 10) * 20);
					rocketR.rotation = 0;
					rocketB.rotation = 0;


					scope.$parent.restartAnim = function(){
						rocketR.x = w / 2;
						rocketR.y = (h / 2) + ((scope.$parent.initial.rocketRVell / 10) * 20);
						rocketR.rotation = 0;
						rocketB.x = (w / 2) - ((scope.$parent.initial.rocketBVell / 10) * 20);
						rocketB.y = h / 2;
						rocketB.rotation = 0;
						createjs.Ticker.setPaused(true);
						scope.$parent.pauseTicker = true;
					};
				});
			}

			function tick(event) {
				//distance = (rocketR.y) - car2.x;

				if (!createjs.Ticker.getPaused()) {
					//Check for collision ball
					//Source: http://gamedev.stackexchange.com/questions/44874/given-an-angle-for-an-arrow-how-do-i-find-its-x-and-y-velocities
					if(rocketR.y - rocketB.y < 0 && rocketR.x - rocketB.x < 0) {
						collationHandle();
					} else {	
						rocketR.y = rocketR.y - rocketR.vel;
						rocketB.x += rocketB.vel;
					}

					if(rocketR.y < 0 - rocketRImg.height) { rocketR.y = h + rocketRImg.height };
					if(rocketB.x > w + rocketBImg.width) { rocketB.x = 0 - rocketBImg.width };
				}

				scope.stage.update(event);
			}

			function collationHandle() {
				//Handle Collision
				//Kuliah fisika dasar 1 PDF * Bukan dikali 2 tapi dikali dirisendiri
				velAfterColY = Math.sqrt(((rocketR.mass * rocketR.vel) * (rocketR.mass * rocketR.vel)) + ((rocketB.mass * 0) * (rocketB.mass * 0))) / (rocketR.mass + rocketB.mass);
				velAfterColX = Math.sqrt(((rocketR.mass * 0) * (rocketR.mass * 0)) + ((rocketB.mass * rocketB.vel) * (rocketB.mass * rocketB.vel))) / (rocketR.mass + rocketB.mass);

				//Handle Rotation
				//http://stackoverflow.com/questions/3449826/how-do-i-find-the-inverse-tangent-of-a-line
				//http://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians
				degree = toDegree(Math.atan((rocketR.mass * rocketR.vel) / (rocketB.mass * rocketB.vel)));

				rocketR.rotation = 90 - (degree + (rocketRImg.width / 2));
				rocketB.rotation = 0 - (degree - (rocketBImg.height));

				rocketR.x += velAfterColX;
				rocketR.y += -velAfterColY;
				rocketB.x += velAfterColX;
				rocketB.y += -velAfterColY;
			}

			function toDegree(angle) {
				return angle * (180 / Math.PI);
			}
		}
	}
});