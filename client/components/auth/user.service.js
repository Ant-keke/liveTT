'use strict';

angular.module('liveTtApp')
  .factory('User', function ($resource, ENV) {
    return $resource(ENV.apiEndpoint + 'api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
