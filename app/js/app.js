'use strict';

// Declare app level module which depends on filters, and services
angular.module('LocalStorageModule').value('prefix', 'myPre');
angular.module('footballTopscorers', [
  'LocalStorageModule',
  'footballTopscorers.controllers',
  'footballTopscorers.directives',
  'footballTopscorers.services',
  'footballTopscorers.filters'
]);
