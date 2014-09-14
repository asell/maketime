angular.module('TaskNewCtrl', []).controller('TaskNewCtrl', function ($scope, $routeParams, $location, UserData) {

    $scope.save = function () {
        if(!$scope.user.task){
            $scope.user.task = [];
        }
        $scope.user.task.push($scope.task);
        $scope.user.$update(function(){
            $location.path('/');
        })
    };

    $scope.init = function () {
        $scope.user = UserData.get({userId: $routeParams.id});
    };

    $scope.init();
});	
