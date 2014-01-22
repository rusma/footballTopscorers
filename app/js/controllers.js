'use strict';

/* Controllers */

angular.module('footballTopscorers.controllers', []).
    controller('topscorersController', function($scope, statsfcApiService, localStorageService) {
    	$scope.home_status = 'true';
    	$scope.away_status = 'true';

    	//3 is both home and away
    	//2 is only away
    	//1 is only home
    	$scope.current_match_type_status = 3;

    	$scope.template_match_data = null;
    	$scope.matches_played = 0;

    	//map colors to each pl team. this could be more dynamic with some kind of color picking mechanism but
    	//that is not within the scope of this project
    	$scope.colors_for_team = {
    		'manchester-city': '#6DAEDF',
    		'chelsea': '#024594',
    		'everton': '#0484C6',
    		'arsenal': '#E02F31',
    		'tottenham-hotspur': '#001C58',
    		'manchester-united': '#E11B22',
    		'liverpool': '#9F2225'
    	};

    	$scope.svg_elem = null;

    	//this template will be used to fill with minutes of goals
		//after that the array will be pushed into another array and emptied again
		$scope.setTemplateToDefault = function() {
			$scope.template_match_data = [
				{index: 0, goals_for_minute: []},
				{index: 5, goals_for_minute: []}, // 0 to 5 minutes
				{index: 10, goals_for_minute: []}, // 6 to 10 minutes
				{index: 15, goals_for_minute: []}, // ..
				{index: 20, goals_for_minute: []},
				{index: 25, goals_for_minute: []},
				{index: 30, goals_for_minute: []},
				{index: 35, goals_for_minute: []},
				{index: 40, goals_for_minute: []},
				{index: 45, goals_for_minute: []},
				{index: 50, goals_for_minute: []},
				{index: 55, goals_for_minute: []},
				{index: 60, goals_for_minute: []},
				{index: 65, goals_for_minute: []},
				{index: 70, goals_for_minute: []},
				{index: 75, goals_for_minute: []},
				{index: 80, goals_for_minute: []},
				{index: 85, goals_for_minute: []},
				{index: 90, goals_for_minute: []},
			];
		};

    	$scope.positionsForTeams = {};

        $scope.loadTablePL = function() {
        	var dfrd = $.Deferred();

        	// localStorageService.set('table_pl', null);
        	//TODO: REMOVE LOCAL STORAGE AND MAKE CHECK FOR MATCHES PLAYED
        	console.log(localStorageService.get('table_pl').played);

        	//remove check for local storage

        	// get new data each time

        	//compare data[0].played to localstorage_val[0].played
        	if(localStorageService.get('table_pl') === null) {
	        	statsfcApiService.getTablePL().then(function(response){
		            if(response.length != 0 || response.error != null) {
		            	localStorageService.add('table_pl', response.data);
		            	var teams_match_data = $scope.loadMatchDataForTeams(response.data, 'premier-league');

		            	teams_match_data.then(function(response){
			        		dfrd.resolve(response);
			        	});
		            } else {
		            	throw "response error while getting pl table";
		            	return;
		            }
		        });
	        } else {
	        	var local_storage_response = localStorageService.get('table_pl');
	        	var teams_match_data = $scope.loadMatchDataForTeams(local_storage_response, 'premier-league');

	        	teams_match_data.then(function(response){
	        		dfrd.resolve(response);
	        	});
	        }

	        return dfrd.promise();
	    };

	    $scope.loadMatchDataForTeams = function(table_data, competition) {
	    	//TO DO: ADD CHECK FOR CHANGE IN LOCAL STORAGE EACH WEEK
	    	var top_five_match_data = {},
	    		dfrd = $.Deferred(),
	    		count = 0,
	    		positions_for_team = {};

	    	//if local storage has the data return that and skip call
	    	//localStorageService.set('top_five_match_data', null)
	    	if( localStorageService.get('top_five_match_data') !== null ) {
	    		dfrd.resolve(localStorageService.get('top_five_match_data'));
			   	return dfrd.promise();
	    	}

	    	_.each(table_data, function(val, index){
	    		var position = val.position;

	    		if(val.position <= 5) {
		    		statsfcApiService.getMatchDataForTeam(val.teampath, competition).then(function(response){
		    			count++;
		    			//get the positions in the table for each team so we
		    			//have the correct sequence later on
		    			//sequence is messed up because asyncness of the request per team
		    			positions_for_team[val.teampath] = val.position;
		    			top_five_match_data[val.teampath] = response;

		    			//if count is 5 and thus we have the top five add value to local storage
		    			//and resolve
		    			if(count === 5) {
			    			localStorageService.add('top_five_match_data', top_five_match_data);
			    			localStorageService.add('positions_for_team', positions_for_team);
			    			dfrd.resolve(top_five_match_data);
			    		}

		    		});

		    	} else {
		    		//we dont want any other league table positions higher than 5
		    		return false;
		    	}

			});

			return dfrd.promise();
		};

		$scope.getGoalMinutesForTopFiveTable = function(top_five_match_data, filter) {
			//create a template for minutes in categories
			$scope.setTemplateToDefault();
			$scope.matches_played = 0;

			var top_five_with_goal_minutes = [],
				count = 1;

			//loop through the match data of the top five PL teams
			_.each(top_five_match_data, function(team, index){
				var current_team = index;

				//get the matches played by looking at the first team's matched played
				//TODO: detect when a team is one match behind
				if($scope.matches_played === 0 ) {
					$scope.matches_played = team.data.length;
				}

				//loop through the matches themselves of a particular team
				_.each(team.data, function(match, index) {
					if(count === $scope.matches_played) {
						top_five_with_goal_minutes.push({ team: current_team, goal_minutes: $scope.template_match_data});

						$scope.setTemplateToDefault();
						count = 1;
					}

					$scope.filterIncidentsOfMatch(current_team, match, filter)

					count++;
				});

			});

			//return the top five PL with all the minutes of their goals categorized
			return top_five_with_goal_minutes;
		};

		$scope.filterIncidentsOfMatch = function(current_team, match, filter) {
			switch($scope.current_match_type_status) {
				case 1:
					if(match.homepath !== current_team) {
						return;
					}
					break;

				case 2:
					if(match.awaypath !== current_team) {
						return;
					}
					break;
			}

			_.each(match.incidents, function(incident, index){
				//filter out cards, own goals etc.

				if(incident.type.toLowerCase() === "goal" && incident.teampath === current_team) {
					//cache the goalminute because later on no access in that scope
					var minute = incident.minute

					_.each($scope.template_match_data, function(template_minute, index){
						//val.index == the outer minute of a category, .i.e. 5-10 = 10
						if(minute >= template_minute.index && minute <= ( template_minute.index + 4 ) ) {
							//push the minute of a goal in a match into a categorie of minutes
							template_minute.goals_for_minute.push(minute);
							return;
						}
					});
				}
			});
		}

		$scope.generateGraphDataForTopFiveMatchData = function(top_five_match_data) {
			var unformatted_top_five_with_goal_minutes = $scope.getGoalMinutesForTopFiveTable(top_five_match_data);
			var formatted_top_five_with_goal_minutes = [];

			console.log(unformatted_top_five_with_goal_minutes);

			// loop through all unformatted data and add only the team as key to the new formatted data
			_.each(unformatted_top_five_with_goal_minutes, function(val, index){
				//added colors to teams
				formatted_top_five_with_goal_minutes.push({'key': val.team, 'color': $scope.colors_for_team[val.team], values: []});
			});

			//make sure the teams are indexed by their position on the league
			var sorted_formatted_top_five_with_goal_minutes = $scope.sortTeamSequence(formatted_top_five_with_goal_minutes);

			//this should also be in a diff function
			_.each(sorted_formatted_top_five_with_goal_minutes, function(team_goal_minutes, index){
				//cache the formatted one because we wont have access in the next function
				var formatted_goal_minutes_team = team_goal_minutes;

				_.each(unformatted_top_five_with_goal_minutes, function(val, index) {
					if(formatted_goal_minutes_team.key === val.team) {
						_.each(val.goal_minutes, function(val, index){
							//calculate the chance of a goal
							formatted_goal_minutes_team.values.push(
								[ val.index, Math.round( (val.goals_for_minute.length / $scope.matches_played) * 100 )]
							);
						});
					}
				});
			});

			return sorted_formatted_top_five_with_goal_minutes;
		};

		$scope.sortTeamSequence = function(formatted_top_five_with_goal_minutes) {
			formatted_top_five_with_goal_minutes.sort(function(a,b){
				var positions_for_team = localStorageService.get('positions_for_team');
				if( positions_for_team[a.key] < positions_for_team[b.key] ) {
					return a - b;
				}
			});

			return formatted_top_five_with_goal_minutes;
		}

		$scope.renderChartWithData = function(data, elem) {
			var selected_svg_elem;

			if($scope.svg_elem === null) {
				selected_svg_elem = elem;

				//cache elem because only the directive can send this
				//if a controller func calls this func then it cant provide the elem
				$scope.svg_elem = elem;
			} else {
				selected_svg_elem = $scope.svg_elem;
			}

			selected_svg_elem.datum(data).transition().duration(600).call($scope.chart);
		};

		//code that checks if a checkbox is checked
		//and then gets the home and or away data
		$scope.switchHomeAwayLeagueData = function(type, status) {
			console.log('CHANGE');
			var change_to_match_type_status;

			if($scope.home_status === 'true' && $scope.away_status === 'false') {
				change_to_match_type_status = 1;
			} else if($scope.away_status === 'true' && $scope.home_status === 'false') {
				change_to_match_type_status = 2;
			} else if($scope.away_status === 'false' && $scope.home_status === 'false') {

				if($scope.current_match_type_status == 1) {
					change_to_match_type_status = 2;
					$("#away_filter").prop('checked', true);
					$scope.away_status = 'true';
				} else {
					change_to_match_type_status = 1;
					$("#home_filter").prop('checked', true);
					$scope.home_status = 'true';
				}

			} else {
				change_to_match_type_status = 3;
			}

			if(change_to_match_type_status === $scope.current_match_type_status) {
				console.log('get no new data');
				return;
			}

			$scope.changeHeadingText(change_to_match_type_status);

			//set new active match_type
			$scope.current_match_type_status = change_to_match_type_status;

			var top_five_match_data = localStorageService.get('top_five_match_data'),
				new_data = $scope.generateGraphDataForTopFiveMatchData(top_five_match_data);

			$scope.renderChartWithData(new_data);
		};

		$scope.changeHeadingText = function(match_type_status) {
			var $elem = $("#match_type");
			switch(match_type_status) {
				case 1:
					$elem.text('a home match');
					break;

				case 2:
					$elem.text('an away match');
					break;
				case 3:
					$elem.text('a match');
				default:
					$elem.text('a match');

			}
		};

		$scope.emptyDataCheck = function(data) {
			throw 'errror';
		}
});