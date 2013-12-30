'use strict';

// Declare app level module which depends on filters, and services
angular.module('LocalStorageModule').value('prefix', 'myPre');
angular.module('footballTopscorers', [
  'LocalStorageModule',
  'footballTopscorers.controllers',
  'footballTopscorers.directives',
  'footballTopscorers.services',
  'footballTopscorers.filters'
]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
