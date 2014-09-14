angular.module('UserData', ['ngResource', 'ngRoute'])
  .factory('UserData', ['$resource', function($resource) {
	return $resource('/api/user', null,{
		'update': { method: 'PUT' }
	});
}]);
