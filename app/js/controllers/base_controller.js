'use strict';

angular.module('footballVis.controllers', []).
    controller('baseController', function($rootScope, statsfcApiService, localStorageService) {
    	$rootScope.home_status = 'true';
    	$rootScope.away_status = 'true';
    	$rootScope.current_season_year = '2013%2F2014'; //this is needed for check at matches played since in old season
    	//there are no matches left to play
    	$rootScope.selected_season_year = '2013%2F2014';//this is just a default value
    	$rootScope.old_season_year = null;//this is to compare the new selected season to the one that
    	//was selected before

    	//3 is both home and away
    	//2 is only away
    	//1 is only home
    	$rootScope.current_match_type_status = 3;
    	$rootScope.set_match_type_heading_text = 'a match'

    	$rootScope.template_match_data = null;
    	$rootScope.matches_played = '-';
    	$rootScope.ticker = $('#matches_played_ticker');

    	$rootScope.top_five_type = 'current';

    	//map colors to each pl team. this could be more dynamic with some kind of color picking mechanism but
    	//that is not within the scope of this project
    	//did the first 10 for now
    	$rootScope.colors_for_team = {
    		'manchester-city': '#6DAEDF',
    		'chelsea': '#024594',
    		'everton': '#0484C6',
    		'arsenal': '#E02F31',
    		'tottenham-hotspur': '#001C58',
    		'manchester-united': '#E11B22',
    		'liverpool': '#9F2225',
    		'newcastle-united': '#020202',
    		'southampton': '#D92128',
    		'aston-villa': '#94BEE3',

    	};

    	$rootScope.svg_elem = null;
		$rootScope.positions_for_team = {};

		//spinner and faded background function
	   	$rootScope.loader = function(remove) {
            var $overlay = $('.overlay'),
                $loader = $('#loader');

            if(remove === true) {
                $overlay.hide();
                $loader.hide();
            } else {
                $overlay.show();
                $loader.show();
            }
        };

    	$rootScope.renderChartWithData = function(data, tooltipContent, chart, elem) {
			var selected_svg_elem,
				_scope = $rootScope;

			chart.tooltipContent(tooltipContent);

			if($rootScope.svg_elem === null) {
				selected_svg_elem = elem;
				//cache elem because only the directive can send this
				//if a controller func calls this func then it cant provide the elem so then it
				//uses the one we binded to the scope
				$rootScope.svg_elem = elem;
			} else {
				selected_svg_elem = $rootScope.svg_elem;
			}

			selected_svg_elem.datum(data).transition().duration(600).call(chart);
		};


});