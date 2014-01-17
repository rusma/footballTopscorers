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
                                    return "<div class='tooltip'><img width='50px' height='50px' src='img/"+ key +".png'><br><span class='chance'>"+
                                    graph.value +"%</span><br>" + graph.point[0] + "th till " + (graph.point[0] + 5) + "th minute" + "</div>";
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
