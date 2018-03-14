angular.module('FisikaApp').directive('inelasticCollSatud', function() {
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
				rail,
				railImg,
				hill,
				hillImg,
				train1,
				train1Img,
				train2,
				train2Img;

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
					scope.stage = new createjs.Stage('incollsatud');
				}

				w = scope.stage.canvas.width;
				h = scope.stage.canvas.height;

				manifest = [
					{ src: 'background.png', id: 'background' },
					{ src: 'cow-hill.png', id: 'cHill' },
					{ src: 'rail.png', id: 'rail' },
					{ src: 'train-1.png', id: 'train1' },
					{ src: 'train-2.png', id: 'train2' }
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
				bg.y = h - bgImg.height;

				rail = new createjs.Shape();
				railImg = loader.getResult('rail');
				rail.graphics.beginBitmapFill(railImg).drawRect(0, 0, w + railImg.width, railImg.height);
				rail.y = h - railImg.height;

				hill = new createjs.Shape();
				hillImg = loader.getResult('cHill');
				hill.graphics.beginBitmapFill(hillImg).drawRect( 0, 0, hillImg.width, hillImg.height);
				hill.y = h - hillImg.height;

				train1 = new createjs.Shape();
				train1Img = loader.getResult('train1');
				train1.graphics.beginBitmapFill(train1Img).drawRect( 0, 0, train1Img.width, train1Img.height );
				train1.x = 35;
				train1.y = rail.y - train1Img.height;
				train1.radius = train1Img.width / 2;

				train2 = new createjs.Shape();
				train2Img = loader.getResult('train2');
				train2.graphics.beginBitmapFill(train2Img).drawRect( 0, 0, train2Img.width, train2Img.height );
				train2.x = w / 2;
				train2.y = rail.y - train2Img.height;
				train2.radius = train2Img.width / 2;

				//create child
				scope.stage.addChild(bg, hill, rail, train1, train2); 
				scope.stage.update();

				createjs.Ticker.timingMode = createjs.Ticker.RAF;
				createjs.Ticker.addEventListener('tick', tick);

				createjs.Ticker.setPaused(scope.$parent.initial.pauseTicker);

				scope.$parent.$watchCollection('initial', function(newVal, oldVal){
					// watch the collection
					createjs.Ticker.setPaused(newVal.pauseTicker);
					train1.mass = scope.$parent.initial.train1Mass;
					train1.vel = newVal.train1Vell / 10;
					train2.mass = newVal.train2Mass;
					train2.vel = newVal.train2Vell / 10;
					scope.$parent.result = ((newVal.train1Mass * newVal.train1Vell) + (newVal.train2Mass * newVal.train2Vell)) / (newVal.train1Mass + newVal.train2Mass);
					scope.$parent.restartAnim = function(){
						train1.x = 35;
						train2.x = w / 2;
						createjs.Ticker.setPaused(true);
						scope.$parent.initial.pauseTicker = true;
					};
				});
			}

			function tick(event) {
				distance = (train1.x + train1Img.width) - train2.x;

				if (!createjs.Ticker.getPaused()) {
					//get distance
					if (distance = 0 || distance > 1) {
						collationHandle();
					} else {
						train1.x += train1.vel;
						train2.x += train2.vel;
					}

					if(train1.x > w) { train1.x = 0 - train1Img.width }
					if(train2.x > w) { train2.x = 0 - train2Img.width }
				}

				scope.stage.update(event);
			}

			function collationHandle() {
				velAfterCol = ((train1.mass * train1.vel) + (train2.mass * train2.vel)) / (train1.mass + train2.mass);
				train1.x += velAfterCol;
				train2.x += velAfterCol;
			}

		}
	}
});