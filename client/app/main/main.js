'use strict';

angular.module('liveTtApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('live', {
        url: '/live/:id',
        templateUrl: 'app/main/live.html',
        controller: 'MainCtrl'
      })
      .state('create', {
        url: '/match/new',
        templateUrl: 'app/main/add-match.html',
        controller: 'MainCtrl'
      });
  });