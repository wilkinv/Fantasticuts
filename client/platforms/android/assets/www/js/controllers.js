angular.module('starter')

.controller('LoginCtrl', function($scope, AuthService, StylistService, $ionicPopup, $state, $ionicHistory) {
  $scope.user = {
    name: '',
    password: ''
  };

  // log in function to see if password matches
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      StylistService.setUsername($scope.user.name);
      $state.go('inside.members');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})

.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };

  // function to register a user
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})

.controller('MembersCtrl', function($scope, AuthService, StylistService, AppointService, API_ENDPOINT, $http, $state, $ionicHistory) {

  $scope.info = {
    username: ''
  }

  $scope.info.username = StylistService.getUsername();

  // function to logout of members area
  $scope.logout = function() {
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    AuthService.logout();
    $state.go('outside.login');
  };

  // function to look at scheduled appointments
  $scope.test = function() {
    $http.post(API_ENDPOINT.url + '/viewappointment', $scope.info).then(function(result) {
      AppointService.setAppointList(result.data.msg);
      $state.go('inside.listAppoints');
    });
  }
})

.controller('FindStylistsCtrl', function($scope, AuthService, StylistService, API_ENDPOINT, $http, $state, $cordovaGeolocation) {
  
  $scope.information = {
    price: '',
    type: '',
    avg_rating: '',
    distance: '',
    lat: '',
    lon: ''
  };

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
 
    // grabs the coordinates of your location
    $scope.information.lat = position.coords.latitude;
    $scope.information.lon = position.coords.longitude;
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);

  }, function(error){
    console.log("Could not get location");
  });

  // function to see all stylists within filters selected
  $scope.getInfo = function() {
    $http.post(API_ENDPOINT.url + '/findstylist', $scope.information).then(function(result) {
      StylistService.setStylistList(result.data.msg);
      $state.go('inside.listStylists');
    });
  };

  // function to logout out of members area
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})

.controller('ListStylistsCtrl', function($scope, $ionicPopup, StylistService, $state) {

  $scope.stylists = StylistService.getStylistList();

  // function to view the information of selected stylist
  $scope.view = function(stylist) {
    StylistService.setStylist(stylist);
    $state.go('inside.stylistInfo');
  };

  // function to view the map with stylists marked as markers
  $scope.viewMap = function() {
    $state.go('inside.map');
  };


})

.controller('StylistInfoCtrl', function($scope, $ionicPopup, $http, StylistService, API_ENDPOINT) {
  console.log(StylistService.getStylist().name);
  
  $scope.appointment = {
    date: '',
    name: '',
    email: '',
    address: '',
    phone_number: '',
    rating: '',
    style: '',
    price: '',
    username: ''
  }

  $scope.confirmAppointment = function() {
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="appointment.date">',
      title: 'Enter Appointment Time',
      subTitle: 'Please enter an actual date',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.appointment.date) {
              //don't allow the user to close unless he enters a date
              e.preventDefault();
            } else {
              $http.post(API_ENDPOINT.url + '/saveappointment', $scope.appointment).then(function(result) {
                
              });
            }
          }
        }
      ]
    });
  };

  // Sets each parameter from service
  $scope.appointment.name = StylistService.getStylist().name;
  $scope.appointment.email = StylistService.getStylist().email;
  $scope.appointment.address = StylistService.getStylist().address;
  $scope.appointment.phone_number = StylistService.getStylist().phone_number;
  $scope.appointment.rating = StylistService.getStylist().avg_rating;
  $scope.appointment.style = StylistService.getStylist().style;
  $scope.appointment.price = StylistService.getStylist().avg_price;
  $scope.appointment.username = StylistService.getUsername();
})

.controller('ListAppointsCtrl', function($scope, $ionicPopup, AppointService, $state) {

  $scope.appoints = AppointService.getAppointList();

  // function to view selected appointment
  $scope.view = function(appoint) {
    AppointService.setAppoint(appoint);
    $state.go('inside.appointInfo');
  };

})

.controller('AppointInfoCtrl', function($scope, $ionicPopup, $http, AppointService, API_ENDPOINT) {
  $scope.appoint = {
    date: '',
    name: '',
    email: '',
    address: '',
    phone_number: ''
  }

  // Sets each parameter from service
  $scope.appoint.date = AppointService.getAppoint().date;
  $scope.appoint.name = AppointService.getAppoint().name;
  $scope.appoint.email = AppointService.getAppoint().email;
  $scope.appoint.address = AppointService.getAppoint().address;
  $scope.appoint.phone_number = AppointService.getAppoint().phone_number;
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, StylistService) {
  var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    // grabs the coordinates of your location
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
    // Adds a marker for each stylist
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
      for (var i = 0; i < StylistService.getStylistList().length; i++) {
        latLng = new google.maps.LatLng(StylistService.getStylistList()[i].location[0],
          StylistService.getStylistList()[i].location[1]);

        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng,
          label: StylistService.getStylistList()[i].name
        });      
        addInfo(marker, StylistService.getStylistList()[i]);
      }
 
    }); 

  }, function(error){
    console.log("Could not get location");
  });

  // when tapping on a marker, this function is called and views the info of stylist
  function addInfo(marker, stylist) {
    google.maps.event.addListener(marker, 'click', function () {
      StylistService.setStylist(stylist);
      console.log(marker.label);
      $state.go('inside.stylistInfo');
    });
  };
})

// Each time switches pages, this function checks if user is still authenticated
.controller('AppCtrl', function($scope, $location, $ionicNavBarDelegate, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});
