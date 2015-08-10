'use strict';

angular.module('liveTtApp')
  .service('$match', function ($q, $http, Auth, $mdToast) {
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
      	return $mdToast.show({
          controller: 'ToastCtrl',
          templateUrl: '/components/toast/add-match-error.html',
          hideDelay: 3000,
          position: 'bottom left'
        });
      }
  	}


  	service.addPlayer = function(player, teamId) {
      return $http.post('/api/teams/' + teamId + '/player', player);
  	}

	return service;
  });
