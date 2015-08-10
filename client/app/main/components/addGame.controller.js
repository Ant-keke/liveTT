'use strict'

angular.module('liveTtApp')
  .controller('AddGameController', function($scope, $mdDialog, $mdToast, match) {
  $scope.match = match;
  $scope.dom = [];
  $scope.ext = [];
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.submit = function() {
  	if($scope.dom.length == $scope.ext.length) {
        if ($scope.dom.length == 1 || $scope.dom.length == 2) {
  	  	var game = {
  	  		dom: $scope.dom,
  	  		ext: $scope.ext,
  	  		score: {
  	  			dom: 0,
  	  			ext: 0,
  	  			details: [{
  	  				dom: 0,
  	  				ext: 0
  	  			},{
              dom: 0,
              ext: 0
            },{
              dom: 0,
              ext: 0
            },{
              dom: 0,
              ext: 0
            },{
              dom: 0,
              ext: 0
            }]
  	  		}
  	  	};
  	    $mdDialog.hide(game);
    	} else {
          $mdToast.show($mdToast.simple().content('Erreur : Un match doit avoir 2 ou 4 joueurs!').theme('danger-toast'));
      }
    } else {
      $mdToast.show($mdToast.simple().content('Erreur : Nombre de joueur inégal').theme('danger-toast'));
    }
  }
  
  $scope.updateTeam = function(team, player) {
  	var id = $scope[team].indexOf(player)
  	if(id < 0 ) {
  		$scope[team].push(player);
  	} else {
  		$scope[team].splice(id, 1);
  	}
  };
    
});