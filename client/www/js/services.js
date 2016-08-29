angular.module('starter')

.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;

  // gets the user's credentials through local storage 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  // stores the user's credentials through local storage
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    console.log(token);
    useCredentials(token);
  }

  // sets user to be authenticated
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }

  // deletes all the user's information
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  // registers a new user
  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  // gets the user to log in if credentials are correct
  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
        if (result.data.success) {
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  // logs the user off
  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();

  return {
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
  };
})

// service to use stylist information between controllers
.service('StylistService', function() {
  var stylistList = [];
  var curStylist;
  var username;

  var setUsername = function(newObj) {
    username = newObj;
  };

  var getUsername = function() {
    return username;
  };

  var setStylistList = function(newObj) {
    stylistList = newObj;
  };

  var getStylistList = function() {
    return stylistList;
  };

  var setStylist = function(obj) {
    curStylist = obj;
  }

  var getStylist = function() {
    return curStylist;
  };

  return {
    setUsername: setUsername,
    getUsername: getUsername,
    setStylist: setStylist,
    getStylist: getStylist,
    setStylistList: setStylistList,
    getStylistList: getStylistList
  };
})

// service to use appointment information between controllers
.service('AppointService', function() {
  var appointList = [];
  var curAppoint;

  var setAppoint = function(newObj) {
    curAppoint = newObj;
  };

  var getAppoint = function() {
    return curAppoint;
  };

  var setAppointList = function(newObj) {
    appointList = newObj;
  };

  var getAppointList = function() {
    return appointList;
  };

  return {
    setAppointList: setAppointList,
    getAppointList: getAppointList,
    setAppoint: setAppoint,
    getAppoint: getAppoint
  }
})

// factory used for authentication
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
