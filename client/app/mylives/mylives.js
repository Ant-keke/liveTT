'use strict';

angular.module('liveTtApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mylives', {
        url: '/mylives',
        templateUrl: 'app/mylives/mylives.html',
        controller: 'MylivesCtrl'
      });
  });