'use strict';

/* Directives */


angular.module('footballTopscorers.directives', []).
  	directive('topscorerBubbleChart', function() {
	    return {
            restrict: 'E', // Directive Scope is Attribute
            link: function (scope, elem, attrs) {
            	console.log(scope);
    		},
		};
	});
