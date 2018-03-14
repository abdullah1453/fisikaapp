angular.module('FisikaApp').directive('elasticCollSatud', function() {
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
			var bg,
				manifest, 
				loader,
				bgImg,
				road,
				roadImg,
				hill,
				hillImg,
				hill2,
				hill2Img,
				car1,
				car1Img,
				car2,
				car2Img;

			var w, 
				h, 
				x, 
				y,
				distance,
				newVelcar1,
				newVelcar2,
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
					scope.stage = new createjs.Stage('collsatud');
				}

				w = scope.stage.canvas.width;
				h = scope.stage.canvas.height;

				manifest = [
					{ src: 'background.png', id: 'background' },
					{ src: 'hill-2.png', id: 'hill-2' },
					{ src: 'hill-1.png', id: 'hill-1' },
					{ src: 'road.png', id: 'road' },
					{ src: 'car-1.png', id: 'car1' },
					{ src: 'car-2-inverse.png', id: 'car2' }
				];

				loader = new createjs.LoadQueue(true);
				loader.addEventListener('complete', handleComplete);
				loader.loadManifest(manifest, true, 'assets/img/_land/png/');
			}

			//handle Complete
			function handleComplete() {

				bg = new createjs.Shape();
				bgImg = loader.getResult('background');
				bg.graphics.beginBitmapFill(bgImg).drawRect(0, 0, w, bgImg.height);

				road = new createjs.Shape();
				roadImg = loader.getResult('road');
				road.graphics.beginBitmapFill(roadImg).drawRect(0, 0, w + roadImg.width, roadImg.height);
				road.y = h - roadImg.height;

				hill2 = new createjs.Shape();
				hill2Img = loader.getResult('hill-2');
				hill2.graphics.beginBitmapFill(hill2Img).drawRect( 0, 0, hill2Img.width, hill2Img.height);

				hill = new createjs.Shape();
				hillImg = loader.getResult('hill-1');
				hill.graphics.beginBitmapFill(hillImg).drawRect( 0, 0, hillImg.width, hillImg.height);
				hill.x = w - hillImg.width;

				car1 = new createjs.Shape();
				car1Img = loader.getResult('car1');
				car1.graphics.beginBitmapFill(car1Img).drawRect( 0, 0, car1Img.width, car1Img.height );
				car1.x = 35;
				car1.y = road.y + car1Img.height - 10;
				car1.radius = car1Img.width / 2;
				car1.regX = car1Img.width / 2;
				// mass and vel must contain variable but % 10 is constant

				car2 = new createjs.Shape();
				car2Img = loader.getResult('car2');
				car2.graphics.beginBitmapFill(car2Img).drawRect( 0, 0, car2Img.width, car2Img.height );
				car2.x = w / 2;
				car2.y = road.y + car1Img.height - 10;
				car2.radius = car2Img.width / 2;
				car2.regX = car1Img.width / 2;

				//create child
				scope.stage.addChild(bg, hill2, hill, road, car1, car2); 
				scope.stage.update();

				createjs.Ticker.timingMode = createjs.Ticker.RAF;
				createjs.Ticker.addEventListener('tick', tick);

				createjs.Ticker.setPaused(scope.$parent.initial.pauseTicker);

				scope.$parent.$watchCollection('initial', function(newVal, oldVal){
					// watch the collection
					createjs.Ticker.setPaused(newVal.pauseTicker);
					car1.mass = newVal.car1Mass;
					car1.vel = newVal.car1Vell / 10;
					car2.mass = newVal.car2Mass;
					car2.vel = newVal.car2Vell / 10;
					scope.$parent.result = ((newVal.car1Mass * newVal.car1Vell) + (newVal.car2Mass * newVal.car2Vell)) / (newVal.car1Mass + newVal.car2Mass);
					scope.$parent.restartAnim = function(){
						car1.x = 35;
						car2.x = w / 2;
						createjs.Ticker.setPaused(true);
						scope.$parent.initial.pauseTicker = true;
					};
				});
			}

			function tick(event) {

				if (!createjs.Ticker.getPaused()) {
					//get distance
					/*
					 * Penjelasan
					 * glosary:
					 * x = koordinat X pada kartesius atau koordinat horizontal
					 * jika mobil2/VW X dikurang mobil1/Bus lebih besar dari radius mobil1 + mobil2 ( kita tau maksudnya disini adalah menentukan apakah kedua mobil berhimpit atau tidak).
					 */
					if (car2.x - car1.x < car1.radius + car2.radius) {
						collationHandle();
					} else {
						car1.x += car1.vel;
						car2.x += car2.vel;
					}

					if(car1.x + car1.radius > w || car1.x - car1.radius < 0) { 
						car1.vel = -car1.vel;
						car1.x += car1.vel;
					}
					if(car2.x + car2.radius > w || car2.x - car2.radius < 0) { 
						car2.vel = -car2.vel
						car2.x += car2.vel;
					}
				}

				scope.stage.update(event);
			}

			function collationHandle() {
				//Calculate Velocity after coll
				//https://en.wikipedia.org/wiki/Elastic_collision#One-dimensional_Newtonian
				// v1' = ((v1 * ( m1 - m2 )) + (2 * (m2 * v2))) / (m1 + m2)
				newVelcar1 = ((car1.vel * (car1.mass - car2.mass)) + (2 * (car2.mass * car2.vel))) / (car1.mass + car2.mass);
				newVelcar2 = ((car2.vel * (car2.mass - car1.mass)) + (2 * (car1.mass * car1.vel))) / (car1.mass + car2.mass);

				car1.vel = newVelcar1;
				car2.vel = newVelcar2;

				car1.x += newVelcar1;
				car2.x += newVelcar2;
			}

		}
	}
});