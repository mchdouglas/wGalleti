(function () {
	'use strict'

	angular
		.module('webProfile')
		
		.filter("trust", function($sce) {
			return function(htmlCode){
				return $sce.trustAsHtml(htmlCode)
			}
		})

		.filter('Date', function() {
		    return function(input) {

		        if (!input) {return};

		        var p = input.split(/[- :]/);
		        p[3] = !p[3] ? 0 : p[3];
	    		p[4] = !p[4] ? 0 : p[4];
	    		p[5] = !p[5] ? 0 : p[5];
		        /* new Date(year, month [, day, hour, minute, second, millisecond]); */
		        return new Date(p[0], p[1] - 1, p[2], p[3], p[4], p[5]);
		    	
		    }
		})


})()