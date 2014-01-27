'use strict';

/* Directives */


angular.module('footballVis.directives', []).
  	directive('matchBarChart', function() {
	    return {
            restrict: 'A', // Directive Scope is attribute
            link: function (scope, elem, attrs) {
              //call initDataLoading which is some sort of Facade that get's the data retrieval
              //and parsing going
            	scope.initDataLoading().then(function(top_five_match_data){
                  nv.addGraph(function() {
                    scope.chart = nv.models.multiBarChart()
                                  .x(function(d) { return d[0] })
                                  .y(function(d) { return d[1] })
                                  .height(400)
                                  .groupSpacing(0.2)
                                  .clipEdge(true);


                    scope.chart.xAxis
                      .tickFormat(function(d) { return d + "m";});

                    scope.chart.yAxis
                      .tickFormat(function(d) { return d + "%"});

                    //get our graph data for our plain match data
                    var data = scope.generateGraphDataForTopFiveMatchData(top_five_match_data);

                    //call the renderChartWithData function inside the controller
                    scope.renderChartWithData(data, d3.select(elem[0]));

                    //make the whole graph resizable
                    nv.utils.windowResize(scope.chart.update);

                    return scope.chart;
                });
            });
    	}
	};
});
