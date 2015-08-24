'use strict';

angular.module('liveTtApp')
  .controller('MainCtrl', function ($scope, $http, socket, $match, $stateParams, $mdDialog, $mdToast, $mdSidenav, $mdUtil, $log, $location, Auth) {

    $scope.isAuth = !!Auth.getCurrentUser()._id;

    /** 
    * @State matchs 
    * @route / 
    */
    $scope.matchs = [];
    $match.getMatchs().then(function(matchs) {
        $scope.matchs = matchs;
    });

    /** 
    * @SideNav Filter Matchs 
    */
    $scope.toggleFilter = buildToggler('filterMatchs');
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          },300);
      return debounceFn;
    }


    
    $scope.divisions = ['PRO A','PRO B','N1','N2','N3','PNZ','R1','R2','R3','R4','R5','PR','D1','D2','D3','D4','D5'];
    
    /** 
    * @State live 
    * @route /live/:id 
    */
    if ($stateParams.id) {
      $match.getMatch($stateParams.id).then(function(match) {
        for (var i = 0; i < match.comments.length; i++) {
          match.comments[i].created = new Date(match.comments[i].created);
        };
        $scope.match = match;
        $scope.match.games = $scope.match.games || [];
        isAuthor();
        socket.syncUpdates('match', $scope.match);
      },function(err){
        $mdToast.show($mdToast.simple().content('Live introuvable!').theme('danger-toast'));
        $location.path('/live');
      });
    }
    
    $scope.deleteMatch = function(match) {
      if($scope.isAuthor) {
        $http.delete('/api/matchs/' + match._id).then(function(res){
          $scope.match = {};
          $location.path('/');
          $mdToast.show($mdToast.simple().content('Match correctement supprimé').theme('success-toast'));
        });
      }
    };

    // $scope.updateGames = function() {
    //   $http.put('/api/matchs/' + match._id, $scope.match).then(function(res){
    //     $scope.lastUpdated = Date.now();
    //   });
    // };
    
    $scope.showAddGameModal = function(ev) {
      if($scope.isAuthor){
        $mdDialog.show({
          controller: 'AddGameController',
          templateUrl: '/app/main/components/add-game.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
           match: angular.copy($scope.match)
         }
        })
        .then(function(game) {
          $http.post('/api/matchs/' + $scope.match._id + '/games', game).then(function(res) {
            $scope.match.games.push(res.data);
            $mdToast.show($mdToast.simple().content('Match correctement crée!').theme('success-toast'));
          },
          function(err){
            $mdToast.show($mdToast.simple().content('Une erreur est survenu!').theme('danger-toast'));
          });
        });
      }
    };
    
    $scope.updateSet = function(matchId,teamType){
      if($scope.isAuthor){
        $scope.match.games[matchId].score[teamType] = (++$scope.match.games[matchId].score[teamType] % 4);
        $match.updateScore($scope.match.games[matchId]._id, $scope.match.games[matchId].score);
      }
    };

    $scope.updatePoints = function(matchId, setId, teamType){
      if($scope.isAuthor) {
        var enabled = true;
        var teamOpp = (teamType == 'dom') ? 'ext' : 'dom';
        /* Check if precedent sets are finished */
        for (var i = 0; i < setId; i++) {
          if($scope.match.games[matchId].score.details[i].dom < 11 && $scope.match.games[matchId].score.details[i].ext < 11) {
            enabled = false;
            return;
          }
        };
        /* Check if last set */
        if(setId < 4 ) {
          if($scope.match.games[matchId].score.details[setId + 1].dom !== 0 || $scope.match.games[matchId].score.details[setId + 1].ext !== 0) {
            enabled = false;
          }
        }

        if($scope.match.games[matchId].score.details[setId][teamOpp] >= 11 && $scope.match.games[matchId].score.details[setId][teamOpp] > $scope.match.games[matchId].score.details[setId][teamType] + 1) {
          enabled =false;
        }

        /* Update points if enabled */
        if (enabled) {
          if($scope.match.games[matchId].score.details[setId][teamType] < 11 || ($scope.match.games[matchId].score.details[setId][teamType] - 1 <= $scope.match.games[matchId].score.details[setId][teamOpp]) ) {
            $scope.match.games[matchId].score.details[setId][teamType]++;
          } else {
            $scope.match.games[matchId].score.details[setId][teamType] = 0;
          }
          $match.updateScore($scope.match.games[matchId]._id, $scope.match.games[matchId].score);
        }
      }
    };

    $scope.updateActive = function() {
      if($scope.isAuthor) {
        $match.updateActive($scope.match._id, $scope.match.active).then(function(res){
          if($scope.match.active){
            $mdToast.show($mdToast.simple().content('Ce live est maintenant actif. Il figure dans la liste des lives en cours.').theme('success-toast'));
          } else {
            $mdToast.show($mdToast.simple().content('Ce live est maintenant inactif.').theme('danger-toast'));
          }
        })
      } 
    }


    $scope.deleteGame = function(index, gameId) {
      if($scope.isAuthor) {
        if(confirm('Etes vous sur de vouloir supprimer ce match ?')) {
          $http.delete("/api/games/" + gameId).then(function(res){
            $scope.match.games.splice(index,1)
           $mdToast.show($mdToast.simple().content('Match correctement supprimé!').theme('success-toast'));
          })
        }
      }
    };


    $scope.deletePlayer = function(index, teamType, playerId) {
      if($scope.isAuthor) {
        if(confirm('Etes vous sur de vouloir supprimer ce joueur ?')) {
          $http.delete("/api/matchs/" + $scope.match._id + "/player/" + playerId).then(function(res){
            $scope.match.team[teamType].players.splice(index,1);
           $mdToast.show($mdToast.simple().content('Joueur correctement supprimé!').theme('success-toast'));
          })
        }
      }
    };




    /** 
    * @State live.create 
    * @route /match/new 
    */
    $scope.player = {
      dom: {},
      ext: {}
    };

    $scope.addMatch = function() {
      if($scope.newMatch === '') {
        return;
      }
      $match.create($scope.newMatch).then(function(res){
        $mdToast.show($mdToast.simple().content('Live correctement crée!').theme('success-toast'));
        
        $location.path('/live/' + res.data._id);
        $scope.newMatch = {};
      })
    };

    /** 
    * @AddPlayer
    * {string} teamType 'dom' or 'ext'
    */
    $scope.addPlayer = function(teamType, form) {
      if($scope.isAuthor) {
        var teamId;
        teamId = $scope.match.team[teamType]._id;
        $match.addPlayer($scope.player[teamType], teamId).then(function(res){
          //Return Player with his id and set res to players array
          $mdToast.show($mdToast.simple().content('Joueur correctement ajouté!').theme('success-toast'));
          form.$setPristine();
          $scope.match.team[teamType].players.push($scope.player[teamType]);
          $scope.player[teamType] = {};
        })
      }
    };

    $scope.comment={};
    /** 
    * @AddComment
    */
    $scope.addComment = function() {
      if($scope.isAuth) {
        $match.addComment($scope.comment.body, Auth.getCurrentUser()._id, $scope.match._id).then(function(res){
          $scope.comment= {};
          $scope.match.comments.push(res.data);
        })
      } else {
          $mdToast.show($mdToast.simple().content('Vous devez etre authentifié pour poster un commentaire.').theme('danger-toast'));
      }
    };

    /** 
    * @RemovePlayer
    * {string} teamType 'dom' or 'ext'
    */
    $scope.removePlayer = function(index, teamType, form) {
      if($scope.isAuthor) {
        var teamId;
        teamId = $scope.match.team[teamType]._id;
        $match.removePlayer($scope.match.team[teamType].players[index]._id, teamId).then(function(res){
          $mdToast.show($mdToast.simple().content('Joueur correctement Supprimé!').theme('danger-toast'));
          form.$setPristine();
          $scope.match.team.dom.players.push($scope.player[teamType]);
          $scope.player[teamType] = {};
        })
      }
    };


    function isAuthor(){
      if($scope.match.author._id == Auth.getCurrentUser()._id){
        $scope.isAuthor = true;
      } else {
        $scope.isAuthor = false;
      }
    }
  });