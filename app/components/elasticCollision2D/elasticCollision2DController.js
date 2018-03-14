angular.module('FisikaApp').controller('collduadController',['$rootScope', '$scope', function($rootScope, $scope){
	// scope for directive and
	// initSlimSlider();

	//to use Math object in angular expression
	//http://stackoverflow.com/questions/12740329/math-functions-in-angular-bindings
	$scope.Math = Math;

	$scope.toDegree = function(angle){
		return angle * (180 / Math.PI);
	}

	$scope.velocity = function(v1, v2) {
		return Math.round(Math.sqrt((v1 * v1) + (v2 * v2)));
	}

	$scope.initial = [
		{
			name: 'Ball 1',
			mass: 17,
			vX: 50,
			vY: 0
		},
		{
			name: 'Ball 2',
			mass: 20,
			vX: 0,
			vY: -80
		},
		{
			name: 'Ball 3',
			mass: 15,
			vX: 0,
			vY: 0
		},
		{
			name: 'Ball 3',
			mass: 23,
			vX: -30,
			vY: 30
		}
	];

	$scope.ba = 1;

	//Mass Options
	$scope.massOpt = {
		floor: 1,
		ceil: 30,
		step: 1,
		showSelectionBar: true,
		translate: function(val) {
			return (val / 10) + " kg";
		}
	}

	//Vell Options
	$scope.vellOpt = {
		floor: -100,
		ceil: 100,
		showSelectionBar: true,
		translate: function(value) {
			return value + " m/s";
		}
	}

	$scope.pauseTicker = true;

	$scope.togglePaused = function(){
		if ($scope.pauseTicker) {
			$scope.pauseTicker = false;
		} else {
			$scope.pauseTicker = true;
		}
	}

	
/*		//-- ISSUE : 2 WAY DATA BINDING NOT WORKING IN LOOP and in Array
	$scope.set = {
		nama: "nama",
		coba: [
			{
				text: "ujang",
				index: "0"
			},
			{
				text: "bangke",
				index: "0"
			}
		]
	}

	console.log($scope.set.coba[0].text);*/
}]);