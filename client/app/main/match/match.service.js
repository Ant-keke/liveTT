'use strict';

angular.module('liveTtApp')
  .service('$match', function ($q, $http, Auth, $mdToast, $timeout) {
	var service = {};

	service.getMatchs = function() {
		var deferred = $q.defer();
		$http.get('/api/matchs').success(function(matchs) {
	        service.matchs = matchs;
	        deferred.resolve(matchs);
		});	
		return deferred.promise;
  	};

  	service.getMatch = function(id) {
		var deferred = $q.defer();
		$http.get('/api/matchs/' + id).success(function(match) {
	        deferred.resolve(match);
		},
		function(err) {
			console.log(err);
		});
		return deferred.promise;
  	};

  	service.create = function(match) {
      match.author = Auth.getCurrentUser()._id;
      if(match.author) {
      	return $http.post('/api/matchs', match);
      } else {
          $mdToast.show($mdToast.simple().content('Vous devez etre connecté pour créer un match').theme('danger-toast'));
      }
  	}

    service.updateActive = function(matchId, active) {
      return $http.put('/api/matchs/' + matchId + '/active', {active: active});
    }

    service.addPlayer = function(player, teamId) {
      return $http.post('/api/teams/' + teamId + '/player', player);
    }


    service.addComment = function(body, authorId, matchId) {
      return $http.post('api/comments', {body:body,author:authorId,match:matchId});
    }

    service.updateScore = function(gameId, score) {
      return $http.put('/api/games/' + gameId + '/score', score);
    }


	return service;
  });
