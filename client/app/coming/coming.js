'use strict';

angular.module('liveTtApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('coming', {
        url: '/coming',
        templateUrl: 'app/coming/coming.html',
        controller: 'ComingCtrl'
      });
  });