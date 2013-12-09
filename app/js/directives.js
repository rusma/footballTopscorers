'use strict';

/* Directives */


angular.module('footballTopscorers.directives', []).
  	directive('topscorerBubbleChart', function() {
	    return {
            restrict: 'A', // Directive Scope is Attribute
            link: function (scope, elem, attrs) {

            	var arr = [
	            	[11, 123, 1236, {label:"Acura", color:'sandybrown'}],
				    [45, 92, 1067, {label:"Alfa Romeo", color:'skyblue'}],
				    [24, 104, 1176, {label:"AM General", color:"salmon"}], [50, 23, 610, {color:"papayawhip"}],
				    [18, 17, 539, "Audi"], [7, 89, 864], [2, 13, 1026, "Bugatti"]
				];

			    var topscorersBubblePlot;

			    topscorersBubblePlot = $.jqplot(attrs.id,[arr],{
			        title: 'Tospcorers goals',
			        seriesDefaults:{
			            renderer: $.jqplot.BubbleRenderer
			        }
			    });
    		},
		};
	});
