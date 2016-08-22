(function () {
	'use strict'

	angular
		.module('webProfile', ['ui.materialize', 'ui.router'])
		.config(Config)
		.run(Run)

	function Config($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/profile');

		$stateProvider
			.state('profile', {
				url : '/profile',
				templateUrl : 'partials/profile.html',
				controller : 'ProfileController',
				controllerAs : 'profile'
			})
	}

	function Run() {
		// body
	}

})()