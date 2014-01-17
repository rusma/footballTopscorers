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
                    var chart = nv.models.multiBarChart()
                                  .x(function(d) { return d[0] })
                                  .y(function(d) { return d[1] })
                                  .height(400)
                                  .clipEdge(true)
                                  .tooltipContent(function(key, y, e, graph){
                                    console.log(key, graph);
                                    return "<img src='hello.png'>" + graph.point[0] + "m till " + (graph.point[0] + 5) + "m";
                                  });

                    chart.xAxis
                      .tickFormat(function(d) { return d + "m";});

                    chart.yAxis
                      .tickFormat(function(d) { return d + "%"});

                    var data = scope.getGraphDataForTopFivePL(top_five_match_data);

                    d3.select(elem[0])
                        .datum(data)
                        .transition().duration(600).call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });
            });
    	}
	};
});
