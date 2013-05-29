'use strict';

/* Controllers */
function homeController($scope, $rootScope, socket, $location, $filter, $routeParams) {

	$scope.query ="";
	$scope.activeTags = [];
	$scope.blackWhite = "null";
	$scope.series = $routeParams.filter;
	$scope.featured = "true";

	if ($scope.series == 'All' || $scope.series == undefined) {
		$scope.featured = 'true';
	} else {
		$scope.featured = 'null';
	}

	socket.emit('init:send');

	socket.on('init:return', function(data) {
		$scope.pics = data.pictures;
		$scope.search();
	});

	// search helpers
	var searchMatch = function (haystack, needle) {
	    if (!needle) {
		    return true;
	    }
	    return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
	};

	var searchColor = function (haystack, needle) {
	    if (needle == "null") {
		    return true;
	    } else if (haystack.toString() !== needle) {
	    	return false
	    } else {
	    	return true
	    }
	};

	var searchSeries = function (haystack, needle) {
	    if (needle == "null") {
		    return true;
	    } else if (haystack.toString() !== needle) {
	    	return false
	    } else {
	    	return true
	    }
	};

	var searchFeatured = function (haystack, needle) {
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
		if ($scope.series == 'All' || $scope.series == undefined) {
			$scope.series='null';
		}

	    $scope.filteredPictures = $filter('filter')($scope.pics, function (picture) {
		    return (searchFeatured(picture.featured, $scope.featured) && searchSeries(picture.series, $scope.series) && searchColor(picture.blackWhite, $scope.blackWhite) && searchMatch(picture.location, $scope.query));
	    });

	    console.log($scope.filteredPictures);

	};

	$scope.goSeries = function(serie) {
		$location.path('/' + serie)
	};
};

function headerController($scope, $rootScope, socket, $location) {
	$scope.goHome = function() {
		$location.path('/')
	};

	$scope.go = function(loc) {
		$location.path('/' + loc)
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

	socket.emit('init:send');

	socket.on('init:return', function(data) {
		$scope.pics = data.pictures;
	});

	$scope.savePicture = function() {
		socket.emit('picture:save', {
			picture:$scope.picture
		});
	}
};

function imageController($scope, $rootScope, socket, $routeParams, $filter, $location) {
	$scope.serie = $routeParams.series;
	$scope.filename = $routeParams.filename;

	socket.emit('init:send');

	socket.on('init:return', function(data) {
		$scope.pics = data.pictures;
		$scope.search();
	});

	var searchSeries = function (haystack, needle) {
	    if (needle == "null") {
		    return true;
	    } else if (haystack.toString() !== needle) {
	    	return false
	    } else {
	    	return true
	    }
	};

	$scope.search = function () {
		console.log("search");

	    $scope.filteredPictures = $filter('filter')($scope.pics, function (picture) {
		    return (searchSeries(picture.series, $scope.serie));
	    });

	    console.log($scope.filteredPictures);

	};

	$scope.goHome = function() {
		$location.path('/');
	}

	var arrayObjectIndexOf = function (myArray, searchTerm, property) {
    	for(var i = 0, len = myArray.length; i < len; i++) {
        	if (myArray[i][property] === searchTerm) {
        		return i;
        	}
    	}
    	return -1;
	}

	$scope.goNextImage = function() {
		console.log("next image");
		var arrayPlace = arrayObjectIndexOf($scope.filteredPictures, $scope.filename, "filename");

		if (arrayPlace == $scope.filteredPictures.length-1) {
			$location.path('/' + $scope.serie + '/' + $scope.filteredPictures[0].filename);
		} else {
			$location.path('/' + $scope.serie + '/' + $scope.filteredPictures[arrayPlace+1].filename);
		}
		
	}
};

function thumbController($scope, $location) {

	$scope.goImage = function() {
		$location.path('/' + $scope.thumb.series + '/' + $scope.thumb.filename);
	}
}

function editController($scope, socket, $location) {
	$scope.updatePicture = function() {
		socket.emit('picture:update', {
			picture: $scope.picture
		})
	}
}

function aboutController($scope) {
	
}

function infoController($scope, $location) {
	$scope.go = function(loc) {
		$location.path('/' + loc)
	};
}

function contactController($scope) {
	
}