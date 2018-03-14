(function () {
	fisikaApp.directive('appColltwodimension', function() {
		'use strict';
		//returning an element
		return {
			restrict : 'EAC',
           	replace : true,
           	scope :{
           	},
           	template: "<canvas id='momentumCanvas' width='960' height='600'></canvas>",
           	link: function (scope, element, attribute) {

				//define variable
				var space,
					spaceImg,
					manifest, 
					loader,
					earth,
					earthImg,
					alienYellow,
					alienYellowImg,
					alienGreen,
					alienGreenImg;

				var w, 
					h, 
					x, 
					y,
					distance,
					velAfterColx,
					velAfterColy,
					runing = false;

				drawApp();

				function drawApp() {
					// drawing app from scratch here

					//check if stage is defined
					if (scope.stage) {
						scope.stage.autoClear = true;
						scope.stage.removeAllChildren();
						scope.stage.update();
					} else {
						scope.stage = new createjs.Stage(element[0]);
					}

					w = scope.stage.canvas.width;
					h = scope.stage.canvas.height;

					manifest = [
						{ src: 'space.png', id: 'space' },
						{ src: 'earth.png', id: 'earth' },
						{ src: 'alien-yellow.png', id: 'ayel' },
						{ src: 'alien-green.png', id: 'agre' }
					];

					loader = new createjs.LoadQueue(true);
					loader.addEventListener('complete', handleComplete);
					loader.loadManifest(manifest, true, 'assets/module/collision/space/png/');
				}

				//handle Complete
				function handleComplete() {

					space = new createjs.Shape();
					spaceImg = loader.getResult('space');
					space.graphics.beginBitmapFill(spaceImg).drawRect(0, 0, w, h);

					earth = new createjs.Shape();
					earthImg = loader.getResult('earth');
					earth.graphics.beginBitmapFill(earthImg).drawRect(0, 0, 480, 438);
					earth.x = (w / 2) - (480 / 2);
					earth.y = (h / 2) - (438 / 2);

					alienYellow = new createjs.Shape();
					alienYellowImg = loader.getResult('ayel');
					alienYellow.graphics.beginBitmapFill(alienYellowImg).drawRect(0, 0, alienYellowImg.width, alienYellowImg.height);
					alienYellow.x = (w / 2) - (alienYellowImg.width / 2);
					alienYellow.y = h - 100;
					alienYellow.regX = alienYellowImg.width / 2;
					alienYellow.regY = alienYellowImg.height / 2;
					alienYellow.radius = alienYellowImg.width / 2;
					alienYellow.mass = 150;
					alienYellow.velx = 0 / 10;
					alienYellow.vely = 50 / 10;

					alienGreen = new createjs.Shape();
					alienGreenImg = loader.getResult('agre');
					alienGreen.graphics.beginBitmapFill(alienGreenImg).drawRect(0, 0, alienGreenImg.width, alienGreenImg.height);
					alienGreen.x = 35;
					alienGreen.y = 200;
					alienGreen.regX = alienGreenImg.width / 2;
					alienGreen.regY = alienGreenImg.height / 2;
					alienGreen.radius = alienGreenImg.width / 2;
					alienGreen.mass = 200;
					alienGreen.velx = 30 / 10;
					alienGreen.vely = 0 / 10;

					console.log(alienGreen.getBounds());

					//create child
					scope.stage.addChild(space, earth, alienYellow, alienGreen); 
					scope.stage.update();

					//createjs.Ticker.timingMode = createjs.Ticker.RAF;
					//createjs.Ticker.addEventListener('tick', tick);

					//console.log(createjs.Ticker.paused);

					//Hasil Asli9
					//console.log("Kecepatan Asli mobil tanpa pembulatan " + (((car1.mass * car1.vel) + (car2.mass * car2.vel)) / (car1.mass + car2.mass)));
				}

				function tick(event) {
					distance = Math.sqrt(
							((alienYellow.x - alienGreen.x) * (alienYellow.x - alienGreen.x))
						  + ((alienYellow.y - alienGreen.y) * (alienYellow.y - alienYellow.y))
						);

					if (distance < alienYellow.radius + alienGreen.radius) {
						collationHandle();
					} else {
						alienYellow.x += alienYellow.vel;
						alienYellow.y += alienYellow.vel;
						alienGreen.x += alienGreen.vel;
						alienGreen.y += alienGreen.vel;
					}

					scope.stage.update(event);
				}

				function collationHandle() {
					/*
						Set velaftercolx dan velaftercoly setelah dapat buat agar kedua
						alien v' kearah yg sama, dan hitung berapa derajat si v'nya itu meluncur
						juga buat rotatsi agar seolah si mobil tertabrak dan berputar. :)
					*/
					velAfterColx = ye;
					car1.x += velAfterCol;
					car2.x += velAfterCol;
				}

				function handleClick() {
					createjs.Ticker.reset();
					createjs.Ticker.init();
				}

			}
		}
	});
})();