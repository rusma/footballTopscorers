'use strict';

/* Directives */


angular.module('footballTopscorers.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
