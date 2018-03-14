angular.module('FisikaApp').controller('incollduadController',['$rootScope', '$scope', function($rootScope, $scope){
	// scope for directive and
	// initSlimSlider();

	//to use Math object in angular expression
	//http://stackoverflow.com/questions/12740329/math-functions-in-angular-bindings
	$scope.Math = Math;

	$scope.toDegree = function(angle){
		return angle * (180 / Math.PI);
	}

	$scope.initial = {
		rocketRMass: 250,
		rocketRVell: 50,
		rocketBMass: 200,
		rocketBVell: 40
	}

	$scope.pauseTicker = true;

	$scope.togglePaused = function(){
		if ($scope.pauseTicker) {
			$scope.pauseTicker = false;
		} else {
			$scope.pauseTicker = true;
		}
	}
	
	//rocketR Mass
	$scope.rocketRMass = {
		floor: 100,
		ceil: 500,
		showSelectionBar: true,
		translate: function(value) {
			return value + " kg";
		}
	}

	//rocketR Vell
	$scope.rocketRVell = {
		floor: 10,
		ceil: 150,
		showSelectionBar: true,
		translate: function(value) {
			return value + " m/s";
		}
	}

	//rocketB Mass
	$scope.rocketBMass = {
		floor: 100,
		ceil: 450,
		showSelectionBar: true,
		translate: function(value) {
			return value + " kg";
		}
	}

	//rocketB Vell
	$scope.rocketBVell = {
		floor: 10,
		ceil: 150,
		showSelectionBar: true,
		translate: function(value) {
			return value + " m/s";
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