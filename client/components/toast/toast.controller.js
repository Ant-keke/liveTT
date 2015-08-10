'use strict';

angular.module('liveTtApp')
	.controller('ToastCtrl', function($scope, $mdToast) {
	  $scope.closeToast = function() {
	    $mdToast.hide();
	  };
	});