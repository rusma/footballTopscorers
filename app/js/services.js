'use strict';

/* Services */


angular.module('footballVis.services', []).
  factory('statsfcApiService', function($http, $cacheFactory) {
  	var statsfcApi = {};

  	statsfcApi.getTablePL = function(season_year) {
  		return $http({
  			method: 'GET',
  			url:'https://willjw-statsfc-competitions.p.mashape.com/table.json?key=GXmBFoBhdMv6kfGExt2xQv5BLtLRlaJ6sOWqAxbr&competition=premier-league&year='+ season_year +'' ,
  		});
  	};

    statsfcApi.getMatchDataForTeam = function(team, competition, season_year) {
      return $http({
        method: 'GET',
        url: 'https://willjw-statsfc-competitions.p.mashape.com/results.json?key=GXmBFoBhdMv6kfGExt2xQv5BLtLRlaJ6sOWqAxbr&competition=' + competition +
        '&team=' + team + '&year='+ season_year +'',
      });
    };

  	return statsfcApi;
  });