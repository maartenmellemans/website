'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['myApp.filters', 'myApp.postFix' ,'myApp.services', 'myApp.directives', 'ui']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/home', controller: homeController});
    $routeProvider.when('/admin', {templateUrl: 'partials/admin', controller: adminController});
    $routeProvider.when('/image/:filename', {templateUrl: 'partials/image', controller: imageController});
    $routeProvider.otherwise({redirectTo: '/'});    
    $locationProvider.html5Mode(true);
  }]);

myApp.run(function ($rootScope, socket, logoutService) {

    $rootScope.$safeApply = function ($scope, fn) {
        $scope = $scope || $rootScope;
        fn = fn || function () {
        };
        if ($scope.$$phase) {
            fn();
            console.log("WARNING: apply nog bezig")
        }
        else {
            $scope.$apply(fn);
        }
    };

    var queries = [
        {
            context: 'normal',
            match: function () {
                console.log('Normal');
                $rootScope.$safeApply($rootScope, function () {
                    $rootScope.medium = "normal";
                })


            },
            unmatch: function () {

            }
        },
        {
            context: 'phone',
            match: function () {
                console.log('Phone');
                $rootScope.$safeApply($rootScope, function () {
                    $rootScope.medium = "phone";
                })

            }
        }
    ];
    // Go!
    MQ.init(queries);

});