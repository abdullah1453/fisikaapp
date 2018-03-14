fisikaApp.directive('tableOfContent', ['$rootScope', '$q', '$http', '$compile', function($rootScope, $q, $http, $compile) {
	return {
		restrict: 'A',
		link: function(scope, element, attribute) {
			scope.$watch(function() { return attribute.number; }, function() {
				$http.get('database/app_nav.json').then(function successCallback(response) {
					var datas = response.data;

					function draw(datas, parent) {

						var outputHtml = '';
						var hasChildren = false;

						angular.forEach(datas, function(value, key) {
							if ( value.parent == parent ) {
								hasChildren = true;
								outputHtml += '<ul><li><span><a ui-sref="' + value.state + '">' + value.name + '</a></span>';
								outputHtml += draw(datas, value.id);
								outputHtml += '</li></ul>';
							}
						});

						if (!hasChildren) { outputHtml = ''; }

						return outputHtml;
					};

					var thecompile = $compile(draw(datas))(scope);
					element.html(thecompile);
				}, function errorCallback(response) {

					console.log(response);
				});
			});
		}
	}
}]);