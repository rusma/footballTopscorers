'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('footballTopscorers.services', []).
  factory('statsfcApiService', function($http, $cacheFactory) {
  	var statsfcApi = {};

  	statsfcApi.getTopScorersPL = function() {
  		return $http({
  			method: 'GET',
  			url: 'https://willjw-statsfc-competitions.p.mashape.com/top-scorers.json?key=free&competition=premier-league&year=2013%2F2014',
  			headers: {"X-Mashape-Authorization": "kFv3KUMDpoxt98Rh6u9ytW5IEpEWdKqQ"}
  		});
  	};

    statsfcApi.getTopScorersCL = function() {
      return $http({
        method: 'GET',
        url: 'https://willjw-statsfc-competitions.p.mashape.com/top-scorers.json?key=free&competition=champions-league&year=2013%2F2014',
        headers: {"X-Mashape-Authorization": "kFv3KUMDpoxt98Rh6u9ytW5IEpEWdKqQ"}
      });
    };



    // if(typeof $httpDefaultCache.get("topscorersPL") === 'undefined') {
    //   console.log('in here');
    //   statsfcApi.getTopScorersPL().success(function(response){
    //     $httpDefaultCache.put("topscorersPL", response);
    //   });
    // } else {
    //   console.log($httpDefaultCache.get("topscorersPL"));
    // }



  	return statsfcApi;
  });