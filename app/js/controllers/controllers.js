'use strict';

/* Controllers */

angular.module('footballTopscorers.controllers', []).
    controller('topscorersController', function($scope, statsfcApiService, localStorageService) {

        $scope.loadTopscorersPL = function() {
        	var dfrd = $.Deferred();

        	console.log(localStorageService.get('topscorersPL'));
        	if(localStorageService.get('localStorageKey') !== null) {
	        	statsfcApiService.getTopScorersPL().success(function(response){
		            if(response.length != 0 || response.error != null) {
		            	localStorageService.add('topscorersPL',response);
		                dfrd.resolve(response);
		            }
		        });
	        } else {
	        	var response = localStorageService.get('topscorersPL');
	        	dfrd.resolve(response);

	        }

	        return dfrd.promise();


	    };

	     $scope.loadTopscorersCL = function() {
        	var dfrd = $.Deferred();
        	statsfcApiService.getTopScorersCL().success(function(response){
	            if(response.length != 0 || response.error != null) {
	                dfrd.resolve(response);
	            }
	        });

	        return dfrd.promise();
	    };

	        $scope.loadTopscorersCLandPL = function() {
        	var dfrd = $.Deferred();
        	statsfcApiService.getTopScorersCL().success(function(response){
	            if(response.length != 0 || response.error != null) {
	            	var goals =
	                dfrd.resolve(response);
	            }
	        });

	        return dfrd.promise();
	    }
});