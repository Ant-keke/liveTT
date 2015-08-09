'use strict';

angular.module('liveTtApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $timeout, $mdToast, $mdSidenav, $mdUtil, $log, $state) {

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $state.go('main');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

   /** 
    * @SideNav 
    */
    $scope.togglesideNav = buildToggler('sideNav');
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

    $scope.navigateTo = function(dest) {
      $mdSidenav('sideNav').close()
        .then(function () {
          $log.debug("close sideNav is done");
          $state.go(dest);
        });
    }
    
  });