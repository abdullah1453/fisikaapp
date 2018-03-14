/*
 * Plugin Environment
 */

 var pageHandle = function () {
 	"use strict";

 	//For Tooltip
 	var initTooltips = function () {
 		$('[data-toggle="tooltip"]').tooltip();
 	}

 	var initWow = function () {
 		var wow = new WOW();
 		wow.init();
 	}

 	//Return in with Object
 	return {
 		init: function() {
 			initTooltips();
 			initWow();
 		}
 	}
 }();