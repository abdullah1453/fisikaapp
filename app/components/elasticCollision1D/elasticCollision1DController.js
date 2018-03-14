angular.module('FisikaApp').controller('collsatudController',['$rootScope', '$scope', function($rootScope, $scope){
	// scope for directive and
	// initSlimSlider();

	$scope.initial = {
		pauseTicker: true,
		car1Mass: 250,
		car1Vell: 50,
		car2Mass: 200,
		car2Vell: -20
	}

	$scope.togglePaused = function(){
		if ($scope.initial.pauseTicker) {
			$scope.initial.pauseTicker = false;
		} else {
			$scope.initial.pauseTicker = true;
		}
	}
	
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