angular.module('TaskCtrl', ['ngRoute'])
	.controller('TaskCtrl', function($scope, $routeParams, $location, UserData) {
	
	$scope.init = function () {
		$scope.user = UserData.get();
	};
	$scope.init();
});
