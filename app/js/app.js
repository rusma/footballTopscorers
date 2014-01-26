'use strict';

// Declare app level module which depends on filters, and services
angular.module('LocalStorageModule').value('prefix', 'myPre');
angular.module('footballVis', [
  'LocalStorageModule',
  'footballVis.controllers',
  'footballVis.directives',
  'footballVis.services',
  'footballVis.filters'
]);
