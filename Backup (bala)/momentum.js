(function () {
	fisikaApp.controller('momentumController',['$rootScope', '$scope', function($rootScope, $scope){
		// scope for directive and
		// initSlimSlider();

		$scope.cars = [
			{
				name: 'Mobil 1/Minibus',
				mass: {
					init: 250,
					options: {
						floor: 100,
						ceil: 500,
						showSelectionBar: true,
						translate: function(value) {
							return value + " kg";
						}
					}
				},
				vell: {
					init: 50,
					options: {
						floor: 10,
						ceil: 130,
						showSelectionBar: true,
						translate: function(value) {
							return value + " m/s";
						}
					}
				}
			},
			{
				name: 'mobil 2/Volkswagen',
				mass: {
					init: 200,
					options: {
						floor: 100,
						ceil: 450,
						showSelectionBar: true,
						translate: function(value) {
							return value + " kg";
						}
					}
				},
				vell: {
					init: -25,
					options: {
						floor: -40,
						ceil: 100,
						showSelectionBar: true,
						translate: function(value) {
							return value + " m/s";
						}
					}
				}
			}
		];

		console.log($scope.cars);

		$scope.pauseTicker = true;

		$scope.togglePaused = function(){
			if ($scope.pauseTicker) {
				$scope.pauseTicker = false;
			} else {
				$scope.pauseTicker = true;
			}
		}

		$scope.$watchCollection('cars',function(newVal){
			console.log(newVal[0]);
		});
		
		//car1 Mass
		$scope.car1Mass = {
			floor: 100,
			ceil: 500,
			showSelectionBar: true,
			translate: function(value) {
				return value + " kg";
			}
		}

		//car1 Vell
		$scope.car1Vell = {
			floor: 10,
			ceil: 130,
			showSelectionBar: true,
			translate: function(value) {
				return value + " m/s";
			}
		}

		//car2 Mass
		$scope.car2Mass = {
			floor: 100,
			ceil: 450,
			showSelectionBar: true,
			translate: function(value) {
				return value + " kg";
			}
		}

		//car2 Vell
		$scope.car2Vell = {
			floor: -40,
			ceil: 100,
			showSelectionBar: true,
			translate: function(value) {
				return value + " m/s";
			}
		}

	}]).directive('appMomentum', function() {
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
					velAfterCol,
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
						scope.stage = new createjs.Stage('app-momentum');
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
					loader.loadManifest(manifest, true, 'assets/module/collision/land/png/');
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
					// mass and vel must contain variable but % 10 is constant

					car2 = new createjs.Shape();
					car2Img = loader.getResult('car2');
					car2.graphics.beginBitmapFill(car2Img).drawRect( 0, 0, car2Img.width, car2Img.height );
					car2.x = w / 2;
					car2.y = road.y + car1Img.height - 10;
					car2.radius = car2Img.width / 2;

					//create child
					scope.stage.addChild(bg, hill2, hill, road, car1, car2); 
					scope.stage.update();

					createjs.Ticker.timingMode = createjs.Ticker.RAF;
					createjs.Ticker.addEventListener('tick', tick);

					createjs.Ticker.setPaused(scope.$parent.pauseTicker);

					scope.$parent.$watch('pauseTicker', function(newVal, oldVal){
						createjs.Ticker.setPaused(newVal);
					});

					scope.$parent.$watchCollection('cars', function(newVal, oldVal){
						// watch the collection
						car1.mass = newVal[0].mass.init;
						car1.vel = newVal[0].vell.init / 10;
						car2.mass = newVal[1].mass.init;
						car2.vel = newVal[1].vell.init / 10;
						console.log(newVal[0].vell.init);
					});
				}

				function tick(event) {
					distance = (car1.x + car1Img.width) - car2.x;

					if (!createjs.Ticker.getPaused()) {
						//get distance
						if (distance = 0 || distance > 1) {
							collationHandle();
						} else {
							car1.x += car1.vel;
							car2.x += car2.vel;
						}

						if(car1.x > w) { car1.x = 0 - car1Img.width }
						if(car2.x > w) { car2.x = 0 - car2Img.width }
					}

					scope.stage.update(event);
				}

				function collationHandle() {
					velAfterCol = Math.round(((car1.mass * car1.vel) + (car2.mass * car2.vel)) / (car1.mass + car2.mass));
					car1.x += velAfterCol;
					car2.x += velAfterCol;
				}

			}
		}
	});
})();
