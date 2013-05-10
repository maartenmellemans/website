'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['myApp.filters', 'myApp.postFix' ,'myApp.services', 'myApp.directives', 'ui']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/home', controller: homeController});
    $routeProvider.when('/:filter', {templateUrl: 'partials/home', controller: homeController});
    $routeProvider.when('/admin', {templateUrl: 'partials/admin', controller: adminController});
    $routeProvider.when('/:series/:filename', {templateUrl: 'partials/image', controller: imageController});
    $routeProvider.when('/about', {templateUrl: 'partials/about', controller: aboutController});
    $routeProvider.when('/info', {templateUrl: 'partials/info', controller: infoController});
    $routeProvider.when('/coolstuff', {templateUrl: 'partials/coolstuff', controller: coolstuffController});
    $routeProvider.when('/contact', {templateUrl: 'partials/contact', controller: contactController});
    $routeProvider.otherwise({redirectTo: '/'});    
    $locationProvider.html5Mode(true);
  }]);

myApp.value('ui.config', {
   // The ui-jq directive namespace
   jq: {
      // The Tooltip namespace
      tooltip: {
         // Tooltip options. This object will be used as the defaults
         placement: 'bottom'
      }
   }
});

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