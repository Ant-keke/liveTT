'use strict';

angular.module('liveTtApp')
  .controller('ComingCtrl', function ($scope, $http, socket, $match, $stateParams, $mdDialog, $mdToast, $mdSidenav, $mdUtil, $log, $location, Auth) {
  	
		$match.getComingMatchs().then(function(res) {
			$scope.matchs = res.data;
		});

  });
