'use strict';

describe('Directive: playerName', function () {

  // load the directive's module and view
  beforeEach(module('liveTtApp'));
  beforeEach(module('app/directives/playerName/playerName.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<player-name></player-name>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the playerName directive');
  }));
});