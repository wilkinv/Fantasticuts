angular.module('starter', ['ionic', 'ngCordova'])

//Each state represents a html page and a controller is associated
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
  .state('inside', {
    url: '/inside',
    abstract: true,
    templateUrl: 'templates/inside.html'
  })
  .state('inside.members', {
    url: '/members',
    templateUrl: 'templates/members.html',
    controller: 'MembersCtrl'
  })
  .state('inside.findStylists', {
    url: '/findStylists',
    templateUrl: 'templates/findStylists.html',
    controller: 'FindStylistsCtrl'
  })
  .state('inside.listStylists', {
    url: '/listStylists',
    templateUrl: 'templates/listStylist.html',
    controller: 'ListStylistsCtrl'
  })
  .state('inside.stylistInfo', {
    url: '/stylistInfo',
    templateUrl: 'templates/stylistInfo.html',
    controller: 'StylistInfoCtrl'
  })
  .state('inside.listAppoints', {
    url: '/listAppoints',
    templateUrl: 'templates/listAppoint.html',
    controller: 'ListAppointsCtrl'
  })
  .state('inside.appointInfo', {
    url: '/appointInfo',
    templateUrl: 'templates/appointInfo.html',
    controller: 'AppointInfoCtrl'
  })
  .state('inside.map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
  });

  $urlRouterProvider.otherwise('/outside/login');
})

// Each time switches pages, this function checks if user is still authenticated
.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      // Brings user back to login page if not authenticated
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});
