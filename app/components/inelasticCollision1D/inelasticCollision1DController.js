angular.module('FisikaApp').controller('incollsatudController',['$rootScope', '$scope', function($rootScope, $scope){
	// scope for directive and
	// initSlimSlider();

	$scope.initial = {
		pauseTicker: true,
		train1Mass: 250,
		train1Vell: 50,
		train2Mass: 200,
		train2Vell: -20
	}

	$scope.togglePaused = function(){
		if ($scope.initial.pauseTicker) {
			$scope.initial.pauseTicker = false;
		} else {
			$scope.initial.pauseTicker = true;
		}
	}
	
	//train1 Mass
	$scope.train1Mass = {
		floor: 100,
		ceil: 500,
		showSelectionBar: true,
		translate: function(value) {
			return value + " kg";
		}
	}

	//train1 Vell
	$scope.train1Vell = {
		floor: 10,
		ceil: 130,
		showSelectionBar: true,
		translate: function(value) {
			return value + " m/s";
		}
	}

	//train2 Mass
	$scope.train2Mass = {
		floor: 100,
		ceil: 450,
		showSelectionBar: true,
		translate: function(value) {
			return value + " kg";
		}
	}

	//train2 Vell
	$scope.train2Vell = {
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