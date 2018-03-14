/***
Fisikaone AngularJS App Main Script
***/

var fisikaApp = angular.module('FisikaApp', ['ngAnimate', 'ui.router', 'oc.lazyLoad', 'ngSlimScroll', 'rzModule']);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
fisikaApp.config(['$ocLazyLoadProvider', '$locationProvider', function($ocLazyLoadProvider, $locationProvider){
	$ocLazyLoadProvider.config({
		// custom config kalau dibutuhkan
	});

	// $locationProvider.html5Mode(true);
}]);

/*
 * Route for the Application
 */
// Beware, this var set to outside the config
// so this is a global variable that can accessed in where ever inside the app
var $urlRouterProviderRef = null;
var $stateProviderRef = null;

fisikaApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
	$locationProvider.html5Mode(false);

	// fill it whit stateProvider and urlRouterProvider services.
	$urlRouterProviderRef = $urlRouterProvider;
	$stateProviderRef = $stateProvider;

}]);

/* Init global settings and run the app */
fisikaApp.run(['$q', '$http', '$rootScope', '$state', '$rootElement', '$compile', function($q, $http, $rootScope, $state, $rootElement, $compile) {
	//Preloader
	$rootScope.$on('$stateChangeStart', function(e, to, toParams, from, fromParams){
		angular.element('.loader-box').addClass('show');
	});	

	$rootScope.$on('$viewContentLoaded', function(e, to, toParams, from, fromParams){
		//use interval to add 1 second.
		setInterval(function(){
			angular.element('.loader-box').removeClass('show');
		}, 3000);

		//Function to animate slider captions 
		function doAnimations( elems ) {
			//Cache the animationend event in a variable
			var animEndEv = 'webkitAnimationEnd animationend';
			
			elems.each(function () {
				var $this = $(this),
				$animationType = $this.data('animation');
				$this.addClass($animationType).one(animEndEv, function () {
					$this.removeClass($animationType);
				});
			});
		}
		
		//Variables on page load 
		var $myCarousel = $('#carousel'),
			$firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");
			
		//Initialize carousel 
		$myCarousel.carousel();

		//Pause carousel  
		$myCarousel.carousel('pause');
		
		//Animate captions in first slide on page load 
		doAnimations($firstAnimatingElems);
		
		//Other slides to be animated on carousel slide event 
		$myCarousel.on('slide.bs.carousel', function (e) {
			var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
			doAnimations($animatingElems);
		});
	});

	$http.get('database/app_route.json').then(function successCallback(response){
		angular.forEach(response.data, function(value, key){
			var stateConfig = {
				url: value.url,
				controller: function() {
					$rootScope.title = value.title;
					angular.element('.content-text .the-text').html($compile(value.data.content)($rootScope));
					angular.element('.content-text .instruction').html($compile(value.data.instruction)($rootScope));
				},
				templateUrl: value.templateUrl
			}

			if (value.deps) {
				stateConfig.resolve = {
					deps: ['$ocLazyLoad', function($ocLazyLoad){
						return $ocLazyLoad.load({
							name: 'dependencies',
							insertBefore: '#ng-load-plugin-dependencies',
							files: value.deps
						});
					}]
				}
			}

			$stateProviderRef.state(value.name, stateConfig);
		});

		$state.go('intro');
		
	}, function errorCallback(response){

		//response when $http could not find data or and error in the middle
		console.log(response);
	});
}]);