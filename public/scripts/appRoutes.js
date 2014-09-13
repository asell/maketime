angular.module('appRoutes', [])
	.config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider){
	    /* $locationProvider.html5Mode(true); */
		$routeProvider
			.when('/', {
				templateUrl: 'views/home.html',
				controller: 'MainCtrl',
			})
			.when('/tasks', {
				templateUrl: 'views/tasks.html',
				controller: 'TaskCtrl',
			})			
			.when('/tasks-new/', {
				templateUrl: 'views/detail.html',
				controller: 'DetailNewCtrl',
			})
			.when('/tasks-edit/:id', {
				templateUrl: 'views/detail.html',
				controller: 'DetailEditCtrl',
			})
			.when('/tasks-delete/:id', {
				templateUrl: 'views/detail.html',
				controller: 'DetailRemoveCtrl',
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl',
			})		
			.when('/signup', {
				templateUrl: 'views/signup.html',
				controller: 'SignupCtrl'
			})
			.when('/settings', {
				templateUrl: 'views/settings.html',
				controller: 'SettingsCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);