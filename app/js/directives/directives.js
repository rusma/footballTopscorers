'use strict';

/* Directives */


angular.module('footballTopscorers.directives', []).
  	directive('topscorerBubbleChart', function() {
	    return {
            restrict: 'A', // Directive Scope is Attribute
            link: function (scope, elem, attrs) {
            	scope.loadTopscorersPL().then(function(response){
            		console.log(response);
            		var goals =  [],
            			names =  [];

    			});
    		}
		}
	});
