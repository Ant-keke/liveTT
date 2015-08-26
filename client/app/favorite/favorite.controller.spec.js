'use strict';

describe('Controller: FavoriteCtrl', function () {

  // load the controller's module
  beforeEach(module('liveTtApp'));

  var FavoriteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FavoriteCtrl = $controller('FavoriteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
