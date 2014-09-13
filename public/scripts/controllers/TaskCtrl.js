angular.module('TaskListCtrl', [])
	.controller('TaskListCtrl', function($scope) {
	
	$scope.user = {
		"email": "test@test.com",
		"tasks": [{
			"id": 1,
			"title": "My first task",
			"type": "general",
			"date": {
				"set": {
					"start": "9/13/14",
					"end": "9/15/14"
					},
				"actual": "9/14/14 8:50 PM"
				},
			"length": "60",
			"descript": "this is a description about the first task.",
			"status": "scheduled"
		},{
			"id": 2,
			"title": "My second task",
			"type": "general",
			"date": {
				"set": {
					"start": "9/15/14",
					"end": "9/19/14"
					},
				"actual": "9/16/14 10:50 AM"
				},
			"length": "30",
			"descript": "this is a description about the second task.",
			"status": "scheduled"
		}]
	};
	
/* 	$scope.addTask = function(id) {
		var user = UserData.get({userID: id}, function() {
			if (!user.tasks) {
				user.tasks = [];
			}
			user.tasks.push({ */
});