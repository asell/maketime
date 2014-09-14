angular.module('TaskNewCtrl', ['ngRoute'])
.controller('TaskNewCtrl', function ($scope, $routeParams, $location, UserData) {
  
  $scope.save = function () {
        if(!$scope.User.task){
            $scope.User.task = [];
        }
        $scope.User.task.push($scope.Task);
        $scope.User.$update(function(){
	 // $location.path('/');
	})
    };

    $scope.init = function () {
        $scope.User = UserData.get();
    };

    $scope.init();
});	
