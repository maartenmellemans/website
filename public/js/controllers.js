'use strict';

/* Controllers */
function homeController($scope, $rootScope, socket, $location, $filter) {
	socket.emit('init:send');

	socket.on('init:return', function(data) {
		$scope.pics = data.pictures;
		$scope.filteredPictures = data.pictures;
		console.log($scope.pics);
	});

	$scope.query ="";
	$scope.activeTags = [];
	$scope.cameraLook = "null";

	// search helpers
	var searchMatch = function (haystack, needle) {
	    if (!needle) {
		    return true;
	    }
	    return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
	};

	var searchBoolean = function (haystack, needle) {
	    if (needle == "null") {
		    return true;
	    } else if (haystack.toString() !== needle) {
	    	return false
	    } else {
	    	return true
	    }
	};

	var hasAllTags = function (haystack, needles) {
		var ret = true;
		angular.forEach(needles, function (needle) {
		    if (haystack.indexOf(needle) === -1) {
		        ret = false;
		    }
		});
		return ret;
	};

	$scope.search = function () {
		console.log("search");
	    $scope.filteredPictures = $filter('filter')($scope.pics, function (picture) {
		    return (searchBoolean(picture.cameraLook, $scope.cameraLook) && searchMatch(picture.location, $scope.query));
	    });

	    console.log($scope.filteredPictures);

	};
};

function headerController($scope, $rootScope, socket, $location) {
	$scope.goHome = function() {
		$location.path('/')
	};

	$scope.goInfo = function() {
		$location.path('/')
	};

	$scope.goContact = function() {
		$location.path('/')
	};
};

function adminController($scope, socket) {
	$scope.picture = {
		"title":"",
		"filename":"",
		"location":"",
		"numberOfPeople":0,
		"series":"",
		"cameraLook":false,
		"featured":false,
		"blackWhite":false,
		"gender":"None"
	};

	$scope.savePicture = function() {
		socket.emit('picture:save', {
			picture:$scope.picture
		});
	}
};

function imageController($scope, $rootScope, socket, $routeParams) {
	$scope.filename = $routeParams.filename;

	$scope.goHome = function() {
		$location.path('/');
	}
};

function thumbController($scope, $location) {
	$scope.goImage = function() {
		$location.path('/image/' + $scope.thumb.filename);
	}
}