'use strict';

angular.module('liveTtApp')
  .service('$match', function ($q, $http, Auth, $mdToast, $timeout, ENV) {
  console.log(ENV);
  var service = {};
	service.getMatchs = function() {
		var deferred = $q.defer();
		$http.get(ENV.apiEndpoint + 'api/matchs').success(function(matchs) {
	        service.matchs = matchs;
	        deferred.resolve(matchs);
		});	
		return deferred.promise;
  	};

  	service.getMatch = function(id) {
  		var deferred = $q.defer();
  		$http.get(ENV.apiEndpoint +  'api/matchs/' + id).success(function(match) {
  	        deferred.resolve(match);
  		},
  		function(err) {
  			console.log(err);
  		});
  		return deferred.promise;
  	};

    service.getActiveMatchs = function() {
      return $http.get(ENV.apiEndpoint + 'api/matchs/active')
    };

    service.getComingMatchs = function() {
      return $http.get(ENV.apiEndpoint + 'api/matchs/coming')
    };

    service.getMyMatchs = function() {
      return $http.get(ENV.apiEndpoint + 'api/matchs/me')
    };

  	service.create = function(match) {
      match.author = Auth.getCurrentUser()._id;
      if(match.author) {
      	return $http.post(ENV.apiEndpoint + 'api/matchs', match);
      } else {
          $mdToast.show($mdToast.simple().content('Vous devez etre connecté pour créer un match').theme('danger-toast'));
      }
  	}

    service.updateActive = function(matchId, active) {
      return $http.put(ENV.apiEndpoint + 'api/matchs/' + matchId + '/active', {active: active});
    }

    service.addPlayer = function(player, teamId) {
      return $http.post(ENV.apiEndpoint + 'api/teams/' + teamId + '/player', player);
    }


    service.addComment = function(body, authorId, matchId) {
      return $http.post(ENV.apiEndpoint + 'api/comments', {body:body,author:authorId,match:matchId});
    }

    service.updateScore = function(gameId, score) {
      return $http.put(ENV.apiEndpoint + 'api/games/' + gameId + '/score', score);
    }

    service.followMatch = function(matchId, userId) {
      return $http.put(ENV.apiEndpoint + 'api/matchs/' + matchId + '/follow', {user:userId});
    }

    service.unFollowMatch = function(matchId, userId) {
      return $http.put(ENV.apiEndpoint + 'api/matchs/' + matchId + '/unfollow', {user:userId});
    }

    service.followedMatch = function(userId) {
      return $http.get(ENV.apiEndpoint + 'api/matchs/followed/' + userId);
    }

	return service;
  });
