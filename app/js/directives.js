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

            		$.each(response, function(index, val){

            			goals.splice(0, 0, val.goals);

            			names.splice(0, 0, val.playershort);
            		});

            		var plot1 = $.jqplot(attrs.id, [goals], {
            		animate: !$.jqplot.use_excanvas,
			            seriesDefaults:{
			                renderer:$.jqplot.BarRenderer,
			                pointLabels: { show: true }
			            },
			            axes: {
			                xaxis: {
			                    renderer: $.jqplot.CategoryAxisRenderer,
			                    ticks: names
			                }
			            },
			            highlighter: { show: false }
			        });

			    });
    		},
		};
	});
