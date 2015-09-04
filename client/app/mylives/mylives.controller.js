'use strict';

angular.module('liveTtApp')
  .controller('MylivesCtrl', function ($scope, $http, socket, $match, $stateParams, $mdDialog, $mdToast, $mdSidenav, $mdUtil, $log, $location, Auth) {
  	
		$match.getMyMatchs().then(function(res) {
			$scope.matchs = res.data;
		});

  });
