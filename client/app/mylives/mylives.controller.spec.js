'use strict';

describe('Controller: MylivesCtrl', function () {

  // load the controller's module
  beforeEach(module('liveTtApp'));

  var MylivesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MylivesCtrl = $controller('MylivesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
