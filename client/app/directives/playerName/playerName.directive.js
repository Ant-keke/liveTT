'use strict';

angular.module('liveTtApp')
  .directive('playerName', function () {
    return {
      templateUrl: 'app/directives/playerName/playerName.html',
      restrict: 'EA',
      scope: {
      	id: '=',
      	players: '='
      },
      link: function (scope, element, attrs) {
      	for (var i = scope.players.length - 1; i >= 0; i--) {
      		if(scope.id == scope.players[i]._id) {
      			scope.fullname = scope.players[i].firstname + ' ' + scope.players[i].lastname;
      			scope.points = scope.players[i].points;
      		}
      	};
      }
    };
  });