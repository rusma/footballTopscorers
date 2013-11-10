'use strict';

/* Controllers */

angular.module('footballTopscorers.controllers', []).
    controller('topscorersController', function($scope) {
    	$scope.topscorersList = [
    		{
    			player: {
    				firstname: 'Cristiano',
    				lastname: 'Ronaldo'
    			},
    			goals: {
    				competition: 14,
    				international: 4,
    				european: 6
    			},
    			nationality: "Portugueze",
    			teams:['Manchester United', 'Real Madrid']
    		},
    		{
    			player: {
    				firstname: 'Karim',
    				lastname: 'Benzema'
    			},
    			goals: {
    				competition: 4,
    				international: 2,
    				european: 2
    			},
    			nationality: "French",
    			teams: ['Olimpique Lyon', 'Real Madrid']

    		},
    	];
   	});