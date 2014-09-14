angular.module('UserData', ['ngResource', 'ngRoute'])
  .factory('UserData', ['$resource', function($resource) {
	return $resource('/user' {
		'update': { method: 'PUT' }
	});
}]);
