'use strict';

angular.module('liveTtApp')
  .controller('MainCtrl', function ($scope, $http, socket, $match, $stateParams, $mdDialog, $mdToast, $mdSidenav, $mdUtil, $log, $location, Auth, ENV) {

    $scope.isAuth = !!Auth.getCurrentUser()._id;
    // load cookie, or start new tour
    $scope.currentStep =  0;
    /** 
    * @State matchs
    * @route / 
    */
    $scope.matchs = [];
    $match.getActiveMatchs().then(function(res) {
        $scope.matchs = res.data;
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
    $scope.zones = ['Z01','Z02','Z03','Z04','Z05','Z06','Z07'];
    $scope.ligues = ['Rhone Alpes','Alsace','Aquitaine','Pays de la Loire','Auvergne','Bourgogne','Bretagne','Champagne Ardennes','PACA','Nord Pas de Calais','Franche Comté','Ile de France','Languedoc Roussillon','Limousin','Lorraine','Basse Normandie','Haute Normandie','Picardie','Poitou Charentes','Provence','Midi Pyrénées','Centre','Corse','Guyane','Reunion','Nouvelle Calédonie','Guadeloupe','Martinique','Mayotte','Tahiti','Wallis Et Futuna'];
    $scope.departements = [{ "id": "01", "nom": "AIN"},{ "id": "02", "nom": "AISNE"},{ "id": "03", "nom": "ALLIER"},{ "id": "04", "nom": "ALPES-DE-HAUTE-PROVENCE"},{ "id": "05", "nom": "HAUTES-ALPES"},{ "id": "06", "nom": "ALPES-MARITIMES"},{ "id": "07", "nom": "ARDECHE"},{ "id": "08", "nom": "ARDENNES"}, { "id": "09", "nom": "ARIEGE"},{ "id": "10", "nom": "AUBE"}, { "id": "11", "nom": "AUDE"},{ "id": "12", "nom": "AVEYRON"},{ "id": "13", "nom": "BOUCHES-DU-RHONE"},{ "id": "14", "nom": "CALVADOS"},{ "id": "15", "nom": "CANTAL"},{ "id": "16", "nom": "CHARENTE"},{ "id": "17", "nom": "CHARENTE-MARITIME"},{ "id": "18", "nom": "CHER"},{ "id": "19", "nom": "CORREZE"},{ "id": "21", "nom": "COTE-D'OR"},{ "id": "22", "nom": "COTES-D'ARMOR"},{ "id": "23", "nom": "CREUSE"},{ "id": "24", "nom": "DORDOGNE"},{ "id": "25", "nom": "DOUBS"},{ "id": "26", "nom": "DROME"},{ "id": "27", "nom": "EURE"},{ "id": "28", "nom": "EURE-ET-LOIR"},{ "id": "29", "nom": "FINISTERE"},{ "id": "2A", "nom": "CORSE-DU-SUD"},{ "id": "2B", "nom": "HAUTE-CORSE"},{ "id": "30", "nom": "GARD"},{ "id": "31", "nom": "HAUTE-GARONNE"},{ "id": "32", "nom": "GERS"},{ "id": "33", "nom": "GIRONDE"},{ "id": "34", "nom": "HERAULT"},{ "id": "35", "nom": "ILLE-ET-VILAINE"},{ "id": "36", "nom": "INDRE"},{ "id": "37", "nom": "INDRE-ET-LOIRE"},{ "id": "38", "nom": "ISERE"},{ "id": "39", "nom": "JURA"},{ "id": "40", "nom": "LANDES"},{ "id": "41", "nom": "LOIR-ET-CHER"},{ "id": "42", "nom": "LOIRE"},{ "id": "43", "nom": "HAUTE-LOIRE"},{ "id": "44", "nom": "LOIRE-ATLANTIQUE"},{ "id": "45", "nom": "LOIRET"},{ "id": "46", "nom": "LOT"},{ "id": "47", "nom": "LOT-ET-GARONNE"},{ "id": "48", "nom": "LOZERE"},{ "id": "49", "nom": "MAINE-ET-LOIRE"},{ "id": "50", "nom": "MANCHE"},{ "id": "51", "nom": "MARNE"},{ "id": "52", "nom": "HAUTE-MARNE"},{ "id": "53", "nom": "MAYENNE"},{ "id": "54", "nom": "MEURTHE-ET-MOSELLE"},{ "id": "55", "nom": "MEUSE"},{ "id": "56", "nom": "MORBIHAN"},{ "id": "57", "nom": "MOSELLE"},{ "id": "58", "nom": "NIEVRE"},{ "id": "59", "nom": "NORD"},{ "id": "60", "nom": "OISE"},{ "id": "61", "nom": "ORNE"},{ "id": "62", "nom": "PAS-DE-CALAIS"}, { "id": "63", "nom": "PUY-DE-DOME"},{ "id": "64", "nom": "PYRENEES-ATLANTIQUES"},{ "id": "65", "nom": "HAUTES-PYRENEES"},{ "id": "66", "nom": "PYRENEES-ORIENTALES"},{ "id": "67", "nom": "BAS-RHIN"},{ "id": "68", "nom": "HAUT-RHIN"},{ "id": "69", "nom": "RHONE"},{ "id": "70", "nom": "HAUTE-SAONE"},{ "id": "71", "nom": "SAONE-ET-LOIRE"},{ "id": "72", "nom": "SARTHE"},{ "id": "73", "nom": "SAVOIE"},{ "id": "74", "nom": "HAUTE-SAVOIE"},{ "id": "75", "nom": "PARIS"},{ "id": "76", "nom": "SEINE-MARITIME"},{ "id": "77", "nom": "SEINE-ET-MARNE"},{ "id": "78", "nom": "YVELINES"},{ "id": "79", "nom": "DEUX-SEVRES"},{ "id": "80", "nom": "SOMME"},{ "id": "81", "nom": "TARN"},{ "id": "82", "nom": "TARN-ET-GARONNE"},{ "id": "83", "nom": "VAR"},{ "id": "84", "nom": "VAUCLUSE"},{ "id": "85", "nom": "VENDEE"},{ "id": "86", "nom": "VIENNE"},{ "id": "87", "nom": "HAUTE-VIENNE"},{ "id": "88", "nom": "VOSGES"},{ "id": "89", "nom": "YONNE"}, { "id": "90", "nom": "TERRITOIRE DE BELFORT"},{ "id": "91", "nom": "ESSONNE"},{ "id": "92", "nom": "HAUTS-DE-SEINE"},{ "id": "93", "nom": "SEINE-SAINT-DENIS"},{ "id": "94", "nom": "VAL-DE-MARNE"},{ "id": "95", "nom": "VAL-D'OISE"}]
    
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
        if($scope.isAuth) {
          $scope.isMatchFollowed = (Auth.getCurrentUser().follow.indexOf($scope.match._id) >= 0);
        } else {
          $scope.isMatchFollowed = false;
        }
        createSocket();
        $scope.match.games = $scope.match.games || [];
        isAuthor();
      },function(err){
        $mdToast.show($mdToast.simple().content('Live introuvable!').theme('danger-toast'));
        $location.path('/live');
      });
    }
    
    $scope.deleteMatch = function(match) {
      if($scope.isAuthor) {
        $http.delete(ENV.apiEndpoint + 'api/matchs/' + match._id).then(function(res){
          $scope.match = {};
          $location.path('/');
          $mdToast.show($mdToast.simple().content('Match correctement supprimé').theme('success-toast'));
        });
      }
    };

    $scope.showAddGameModal = function(ev) {
      if($scope.isAuthor){
        if ($scope.match.team.dom.players.length == 0 || $scope.match.team.ext.players.length == 0) {
              $mdToast.show($mdToast.simple().content('Veuillez ajouter au minimum un joueur par équipe (onglet Equipe) avant de créer un match').theme('danger-toast'));
        } else {
          $mdDialog.show({
            controller: 'AddGameController',
            templateUrl: 'app/main/components/add-game.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
             match: angular.copy($scope.match)
           }
          })
          .then(function(game) {
            game.match = $scope.match;
            $http.post(ENV.apiEndpoint + 'api/matchs/' + $scope.match._id + '/games', game).then(function(res) {
              $scope.match.games.push(res.data);
              $mdToast.show($mdToast.simple().content('Match correctement crée!').theme('success-toast'));
            },
            function(err){
              $mdToast.show($mdToast.simple().content('Une erreur est survenu!').theme('danger-toast'));
            });
          });
        }
      }
    };
    
    $scope.updateSet = function(matchId,teamType){
      if(!$scope.waitScore && $scope.isAuthor && checkActive()){
        $scope.match.games[matchId].score[teamType] = (++$scope.match.games[matchId].score[teamType] % 4);
        $scope.waitScore = true;
        $match.updateScore($scope.match.games[matchId]._id, $scope.match.games[matchId].score).then(function(res) {
          $scope.waitScore = false;
        });
      }
    };

    $scope.updatePoints = function(matchId, setId, teamType){
      if(!$scope.waitScore && $scope.isAuthor && checkActive()) {
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
          $scope.waitScore = true;
          $match.updateScore($scope.match.games[matchId]._id, $scope.match.games[matchId].score).then(function(res) {
            $scope.waitScore = false;
          });
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
    };

     function checkActive() {
      if($scope.match.active) {
          return true;
        } else {
          $mdToast.show($mdToast.simple().content('Impossible de modifier le score. Ce live n\'est pas encore actif. Swippez en haut à droite pour l\'activer').theme('danger-toast'));
          return false;
        }
    };

    $scope.followMatch = function() {
      if($scope.isAuth) {
        if(!$scope.isMatchFollowed) {
          $match.followMatch($scope.match._id, Auth.getCurrentUser()._id).then(function(res){
            $scope.isMatchFollowed = true;
            $scope.match = res.data;
            Auth.getCurrentUser().follow = Auth.getCurrentUser().follower || [];
            Auth.getCurrentUser().follow.push($scope.match._id);
            $mdToast.show($mdToast.simple().content('Match correctement ajouté aux favoris').theme('success-toast'));
          });
        } else {
          $mdToast.show($mdToast.simple().content('Ce match est déja dans vos favoris').theme('success-toast'));
        }
      } else {
          $mdToast.show($mdToast.simple().content('Vous devez etre authentifié pour ajouter un match à vos favoris.').theme('danger-toast'));
      }
    } 

    $scope.unFollowMatch = function() {
        if($scope.isMatchFollowed) {
          $match.unFollowMatch($scope.match._id, Auth.getCurrentUser()._id).then(function(res){
            $scope.isMatchFollowed = false;
            $mdToast.show($mdToast.simple().content('Match correctement supprimé de vos favoris').theme('success-toast'));
          });
        } else {
          $mdToast.show($mdToast.simple().content('Ce match n\'est pas dans vos favoris').theme('success-toast'));
        }
    } 


    $scope.deleteGame = function(index, gameId) {
      if($scope.isAuthor) {
        if(confirm('Etes vous sur de vouloir supprimer ce match ?')) {
          $http.delete(ENV.apiEndpoint + "api/games/" + gameId).then(function(res){
            $scope.match.games.splice(index,1)
           $mdToast.show($mdToast.simple().content('Match correctement supprimé!').theme('success-toast'));
          })
        }
      }
    };


    $scope.deletePlayer = function(index, teamType, playerId) {
      if($scope.isAuthor) {
        if(confirm('Etes vous sur de vouloir supprimer ce joueur ?')) {
          $http.delete(ENV.apiEndpoint + "api/teams/" + $scope.match.team[teamType]._id + "/player/" + playerId).then(function(res){
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
          $scope.match.team[teamType].players.push(res.data);
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
        console.log($scope.comment)
        if($scope.comment.body && $scope.comment.body != null) {
          $match.addComment($scope.comment.body, Auth.getCurrentUser()._id, $scope.match._id).then(function(res){
            $scope.comment= {};
            $scope.match.comments.push(res.data);
          });
        }
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


    /* Socket */
    function createSocket(){
      socket.syncUpdates($scope.match._id, $scope.match,  function(event, item) {
          console.log(item);
          $scope.match = item;
      });
     $scope.$on('$destroy', function () {
        socket.unsyncUpdates($scope.match._id);
      });
   };


  });



