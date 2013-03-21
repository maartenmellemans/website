'use strict';

/* Services */
angular.module('myApp.postFix', [], function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data)
  {
    return angular.isObject(data) && String(data) !== '[object File]' ? jQuery.param(data) : data;
  }];
})

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [], function($provide) {

   $provide.factory('socket', function ($rootScope) {
      var socket = io.connect();
      return {
         on: function (eventName, callback) {
            socket.on(eventName, function () {  
               var args = arguments;
               $rootScope.$apply(function () {
                  callback.apply(socket, args);
               });
            });
         },
         emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
               var args = arguments;
               $rootScope.$apply(function () {
                  if (callback) {
                     callback.apply(socket, args);
                  }
               });
            })
         },
      };
   });

   $provide.factory('loginService', function ($http) {
         var loginService = function LoginService() {
         };

         loginService.prototype.post = function (username, password, callback) {
            $http.post('/login', {username:username.toLowerCase(), password:password}).success(callback).error(callback);
         };

         return new loginService();
      });

   $provide.factory('logoutService', function ($http) {
         var logoutService = function LogoutService() {
         };

         logoutService.prototype.post = function (callback) {
            $http.post('/logout').success(callback);
         };

         return new logoutService();
      });

    $provide.factory('validateService', function ($http) {
         var validateService = function ValidateService() {
         };

         validateService.prototype.post = function (username, password, callback) {
            $http.post('/validate', {username:username.toLowerCase(), password:password}).success(callback).error(callback);
         };

         return new validateService();
      });
});
