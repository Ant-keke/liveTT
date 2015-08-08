'use strict';

angular.module('liveTtApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeMatchs = [];

    $http.get('/api/matchs').success(function(matchs) {
      $scope.matchs = matchs;
      socket.syncUpdates('match', $scope.matchs);
    });

    $scope.addMatch = function() {
      if($scope.newMatch === '') {
        return;
      }
      $http.post('/api/matchs', { name: $scope.newMatch });
      $scope.newMatch = '';
    };

    $scope.deleteMatch = function(match) {
      $http.delete('/api/matchs/' + match._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('match');
    });
  });
