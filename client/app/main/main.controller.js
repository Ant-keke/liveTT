'use strict';

angular.module('liveTtApp')
  .controller('MainCtrl', function ($scope, $http, socket, $match, $stateParams, $mdToast, $state, $mdSidenav, $mdUtil, $log, $location) {

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


    
    $scope.deleteMatch = function(match) {
      $http.delete('/api/matchs/' + match._id);
    };
    $scope.divisions = ['PRO A','PRO B','N1','N2','N3','PNZ','R1','R2','R3','R4','R5','PR','D1','D2','D3','D4','D5'];
    
    /** 
    * @State live 
    * @route /live/:id 
    */
    if ($stateParams.id) {
      $match.getMatch($stateParams.id).then(function(match) {
        $scope.match = match;
        socket.syncUpdates('match', $scope.match);
      });
    }
    
    $scope.addGame = function() {
      if(!$scope.newGame) {
        return;
      }
      $scope.match.games.push($scope.newGame);
      $http.post('/api/matchs/' + $scope.match._id +'/game', $scope.newGame).then(function(res){
      });
      $scope.newGame = '';
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('match');
    });

    $scope.tabs = {
      selectedIndex: 0
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
        $mdToast.show({
          controller: 'ToastCtrl',
          templateUrl: '/components/toast/add-match-success.html',
          hideDelay: 3000,
          position: 'bottom left'
        });
        $location.path('/live/' + res.data._id);
        $scope.newMatch = {};
      })
    };

    /** 
    * @AddPlayer
    * {string} teamType 'dom' or 'ext'
    */
    $scope.addPlayer = function(teamType, form) {
      var teamId;
      teamId = $scope.match.team[teamType]._id;
      $match.addPlayer($scope.player[teamType], teamId).then(function(res){
        //Return Player with his id and set res to players array

        $mdToast.show({
          controller: 'ToastCtrl',
          templateUrl: '/components/toast/add-player-success.html',
          hideDelay: 3000,
          position: 'bottom left'
        });
        form.$setPristine();
        $scope.match.team.dom.players.push($scope.player[teamType]);
        $scope.player[teamType] = {};
      })
    };

    /** 
    * @RemovePlayer
    * {string} teamType 'dom' or 'ext'
    */
    $scope.removePlayer = function(index, teamType, form) {
      var teamId;
      teamId = $scope.match.team[teamType]._id;
      $match.removePlayer($scope.match.team[teamType].players[index]._id, teamId).then(function(res){
        $mdToast.show({
          controller: 'ToastCtrl',
          templateUrl: '/components/toast/add-player-success.html',
          hideDelay: 3000,
          position: 'bottom left'
        });
        form.$setPristine();
        $scope.match.team.dom.players.push($scope.player[teamType]);
        $scope.player[teamType] = {};
      })
    };


  });
