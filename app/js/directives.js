'use strict';

/* Directives */


angular.module('footballTopscorers.directives', []).
  	directive('topscorerBubbleChart', function() {
	    return {
            restrict: 'A', // Directive Scope is Attribute
            link: function (scope, elem, attrs) {
                //this doesnt make any sense..
            	scope.loadTablePL().then(function(top_five_match_data){
                  nv.addGraph(function() {
                    var chart = nv.models.stackedAreaChart()
                                   .x(function(d) { return d[0] })
                                   .y(function(d) { return d[1] })
                                   .clipEdge(true);

                    chart.xAxis
                      .tickFormat(function(d) { return d + "m";});

                    chart.yAxis
                      .tickFormat(d3.format(',.2f'));

                    var data = scope.getGraphDataForTopFivePL(top_five_match_data);

                    d3.select(elem[0])
                        .datum(data)
                        .transition().duration(1000).call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });
            });
    	}
	};
});
