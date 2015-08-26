'use strict';

angular.module('liveTtApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('favorite', {
        url: '/favorite',
        templateUrl: 'app/favorite/favorite.html',
        controller: 'FavoriteCtrl'
      });
  });