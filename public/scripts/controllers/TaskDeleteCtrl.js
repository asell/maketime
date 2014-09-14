angular.module('TaskDeleteCtrl', ['ngRoute'])
  .controller('TaskDeleteCtrl', function ($scope, $routeParams, $location, UserData) {
	$scope.user = null;
	
	$scope.save = function () {
	};
	function checkUser(u) {
	}

	$scope.init = function () {
	$scope.user = UserData.get(function (user){
	    var start = -1;
		for (var x = 0; x < user.task.length; x++) {
		  if (user.task[x]._id == $routeParams.task) {
		    start = x;
		  }
		}
		if(start >= 0){
		 user.task.splice(start, 1);
		  user.$update(function(){
		    $location.path('/');
		  })
		}
}
);
	};
	$scope.init();
});
