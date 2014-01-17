'use strict';

/* Controllers */

angular.module('footballTopscorers.controllers', []).
    controller('topscorersController', function($scope, statsfcApiService, localStorageService) {
    	$scope.template_match_data = null;
    	$scope.matches_played = 0;
    	$scope.colorsForTeam = {
    		'manchester-city': '#6DAEDF',
    		'chelsea': '#024594',
    		'everton': '#0484C6',
    		'arsenal': '#E02F31',
    		'tottenham-hotspur': '#001C58',
    		'manchester-united': '#E11B22',
    		'liverpool': '#9F2225'
    	};

    	$scope.positionsForTeams = {};

        $scope.loadTablePL = function() {
        	var dfrd = $.Deferred();

        	// localStorageService.set('table_pl', null);
        	//TODO: REMOVE LOCAL STORAGE AND MAKE CHECK FOR MATCHES PLAYED
        	if(localStorageService.get('table_pl') === null) {
	        	statsfcApiService.getTablePL().then(function(response){
		            if(response.length != 0 || response.error != null) {
		            	localStorageService.add('table_pl', response.data);
		            	var teams_match_data = $scope.loadDataForTeams(response.data, 'premier-league');

		            	teams_match_data.then(function(response){
			        		dfrd.resolve(response);
			        	});
		            }
		        });
	        } else {
	        	var response = localStorageService.get('table_pl');
	        	var teams_match_data = $scope.loadDataForTeams(response, 'premier-league');

	        	teams_match_data.then(function(response){
	        		dfrd.resolve(response);
	        	});
	        }

	        return dfrd.promise();
	    };

	    $scope.loadDataForTeams = function(table_data, competition) {
	    	//TO DO: ADD CHECK FOR CHANGE IN LOCAL STORAGE EACH WEEK
	    	// localStorageService.set('top_five_match_data', null);
	    	var top_five_match_data = {};

	    	var dfrd = $.Deferred();
	    	var count = 0;
	    	var positions_for_team = {};

	    	//if local storage has the data return that and skip call
	    	//localStorageService.set('top_five_match_data', null)
	    	if( localStorageService.get('top_five_match_data') !== null ) {
	    		dfrd.resolve(localStorageService.get('top_five_match_data'));
	    		console.log(localStorageService.get('top_five_match_data'));
			   	return dfrd.promise();
	    	}
	    	_.each(table_data, function(val, index){
	    		var position = val.position;
	    		if(val.position <= 5) {
		    		statsfcApiService.getMatchDataForTeam(val.teampath, competition).then(function(response){
		    			count ++;

		    			positions_for_team[val.teampath] = val.position;
		    			top_five_match_data[val.teampath] = response;

		    			if(count === 5) {
			    			localStorageService.add('top_five_match_data', top_five_match_data);
			    			localStorageService.add('positions_for_team', positions_for_team);
			    			dfrd.resolve(top_five_match_data);
			    		}


		    		});

		    	} else {
		    		return false;
		    	}

			});

			return dfrd.promise();
		};

		$scope.getGoalMinutesForTopFivePL = function(top_five_match_data) {
			//this template will be used to fill with minutes of goals
			//after that the array will be pushed into another array and emptied again

			//create a template for minutes in categories
			$scope.setTemplateToDefault();
			$scope.matches_played = 0;

			var top_five_with_goal_minutes = [],
				count = 1;

			//loop through the match data of the top five PL teams
			_.each(top_five_match_data, function(val, index){
				var team = index;

				//get the matches played by looking at the first team's matched played
				//TODO: detect when a team is one match behind
				if($scope.matches_played === 0 ) {
					$scope.matches_played = val.data.length;
				}


				//used jquery each for array, underscore didnt work
				//loop through the matches themselves of a particular team
				$.each(val.data, function(index, val) {
					if(count === $scope.matches_played) {
						top_five_with_goal_minutes.push({ team: team, goal_minutes: $scope.template_match_data});

						$scope.setTemplateToDefault();
						count = 1;
					}

					//loop through the incidents of a match
					_.each(val.incidents, function(val, index){
						//filter out cards, own goals etc.

						if(val.type.toLowerCase() === "goal" && val.teampath === team) {
							//cache the goalminute because later on no access in that scope
							var minute = val.minute

							$.each($scope.template_match_data, function(index, val){
								//val.index == the outer minute of a categorie, .i.e. 5-10 = 10
								if(minute >= val.index && minute <= ( val.index + 4 ) ) {
									//push the minute of a goal in a match into a categorie of minutes
									val.goals_for_minute.push(minute);
									return;
								}
							});
						}
					});
					count++;
				});

			});

			//return the top five PL with all the minutes of their goals categorized
			return top_five_with_goal_minutes;
		};

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

		$scope.getGraphDataForTopFivePL = function(top_five_match_data) {
			var top_five_with_goal_minutes = $scope.getGoalMinutesForTopFivePL(top_five_match_data);
			var formatted_top_five_with_goal_minutes = [];

			_.each(top_five_with_goal_minutes, function(val, index){
				//add colors here per team
				formatted_top_five_with_goal_minutes.push({'key': val.team, 'color': $scope.colorsForTeam[val.team], values: []});
			});

			formatted_top_five_with_goal_minutes.sort(function(a,b){
				var positions_for_team = localStorageService.get('positions_for_team');
				if( positions_for_team[a.key] < positions_for_team[b.key] ) {
					return a-b;
				}
			});


			_.each(formatted_top_five_with_goal_minutes, function(val, index){
				//cache the formatted one because we wont have access in the next function
				var formatted_one = val;

				_.each(top_five_with_goal_minutes, function(val, index) {
					if(formatted_one.key === val.team) {
						_.each(val.goal_minutes, function(val, index){
							//calculate the chance of a goal
							formatted_one.values.push(
								[ val.index, Math.round( (val.goals_for_minute.length / $scope.matches_played) * 100 )]
							);
						});
					}
				});
			});

			return formatted_top_five_with_goal_minutes;

		};

		//code that checks if a checkbox is checked
		//and then gets the home and or away data
});