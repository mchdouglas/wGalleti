(function () {
	'use strict'

	angular
		.module('webProfile')
		.controller('ProfileController', ProfileController)

	function ProfileController(ProfileService) {
		var vm = this

		vm.dataProfile = ProfileService

		vm.ratingStar = function(n) {
			var arr = [];

			for (var i = 0; i < n; i++) {
				arr.push('start' + i)
			}
			
	        return arr
	    }
	}

})() 