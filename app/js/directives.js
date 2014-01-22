'use strict';

/* Directives */


angular.module('footballTopscorers.directives', []).
  	directive('topscorerBubbleChart', function() {
	    return {
            restrict: 'A', // Directive Scope is Attribute
            link: function (scope, elem, attrs) {
              //this doesnt make any sense.. loadtable -->match_data returned
            	scope.loadTablePL().then(function(top_five_match_data){
                  console.log(top_five_match_data);
                  nv.addGraph(function() {
                    scope.chart = nv.models.multiBarChart()
                                  .x(function(d) { return d[0] })
                                  .y(function(d) { return d[1] })
                                  .height(400)
                                  .clipEdge(true)
                                  .tooltipContent(function(key, y, e, graph){
                                    return "<div class='tooltip'><img width='50px' height='50px' src='img/"+ key +".png'><br><span class='chance'>"+
                                    graph.value +"%</span><br>" + graph.point[0] + "th till " + (graph.point[0] + 5) + "th minute" + "</div>";
                                  });

                    scope.chart.xAxis
                      .tickFormat(function(d) { return d + "m";});

                    scope.chart.yAxis
                      .tickFormat(function(d) { return d + "%"});

                    var data = scope.generateGraphDataForTopFiveMatchData(top_five_match_data);
                    scope.renderChartWithData(data, d3.select(elem[0]));

                    nv.utils.windowResize(scope.chart.update);

                    return scope.chart;
                });
            });
    	}
	};
});
