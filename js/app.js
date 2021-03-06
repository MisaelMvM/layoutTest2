var app = angular.module('RegisterApp', ['ngMaterial', 'ngMessages']);

app.config(function($httpProvider, $mdThemingProvider){
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $mdThemingProvider.theme('registerTheme')
    .primaryPalette('blue')
    .accentPalette('pink')
    .warnPalette('pink');
  $mdThemingProvider.setDefaultTheme('registerTheme');
});

app.run(function(){
  console.log("App is runing!");
  //This will ask permission so that's not a good
  /*
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
      };
      f.log(pos);
    });
  }
  */
});

app.factory('googleMapService', function($http, $q) {
	console.log("factory is runing!");
  return {
    getAutoCompleteResult: function(searchText) {
      var deferred = $q.defer();

      var service = new google.maps.places.AutocompleteService();

      brooklynLatLng = new google.maps.LatLng({lat: 40.6782, lng: -73.9442});

      service.getQueryPredictions({ input: searchText, location: brooklynLatLng, radius: 0 }, function(predictions, status) {
       
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          deferred.resolve(predictions);
        } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {

          deferred.resolve([]);
        }
        else {
          deferred.reject([]);
        }
      });
      return deferred.promise;
    },
    getUserAddress: function(selectedItem){
      var deferred = $q.defer();
      deferred.resolve(selectedItem.description);
      return deferred.promise;
    },
    getAddressMapImageLg: function(selectedItem) {
      var deferred = $q.defer();
      var BACKEND_URL = "https://maps.googleapis.com/maps/api/staticmap?center="+selectedItem.description+"&zoom=15&size=600x150&scale=1&markers=color:purple%7Clabel:S%7C11211&key=AIzaSyDjNCOtzqN1fXTqFM2DUYQaLyw5k-oDOFw";
      deferred.resolve(BACKEND_URL);
      return deferred.promise;
    },
    getAddressMapImageSm: function(selectedItem) {
      var deferred = $q.defer();
      var BACKEND_URL = "https://maps.googleapis.com/maps/api/staticmap?center="+selectedItem.description+"&zoom=15&size=250x150&scale=1&markers=color:purple%7Clabel:S%7C11211&key=AIzaSyDjNCOtzqN1fXTqFM2DUYQaLyw5k-oDOFw";
      deferred.resolve(BACKEND_URL);
      return deferred.promise;
    }
  }
});

app.controller('AppCtrl', function($scope, $timeout, googleMapService) {
  var self = this;
  var BACKEND_URL = "/place/autocomplete/";

  $scope.typing = true;
  $scope.start1 = false;
  $scope.start2 = false;
  $scope.start3 = false;
  $scope.inputName = false;
  $scope.inputNameOn = false;
	$scope.inputNameStatic= false;
  $scope.hello1 = false;
  $scope.hello2 = false;
  $scope.inputPlace = false;
  $scope.showMap = false;  
  $scope.createUser1 = false;
  $scope.createUser2 = false;
  $scope.inputInfo = false;
  $scope.inputInfoOn = false;
  $scope.inputEmailStatic = false;
  $scope.congrats = false;

  $scope.cName = null;
  $scope.cLastName = null;

  $scope.selecteAddress = null;

  $scope.email = null;
  $scope.phone = null;
  $scope.password = null;

  $scope.autoCompleteResults = null;
  $scope.selectedItemImageURLLg = null;
  $scope.selectedItemImageURLSm = null;

  self.botTalk = 

  self.businessCategories = []

  self.googleMapService = googleMapService;

  self.loadBusinessCategories = function() {
    // Use timeout to simulate a 1200ms request.
    return $timeout(function() {
      self.businessCategories = [{label:'Cocktail Bar', value:3}, {label:'Restaurant', value:1}, {label:'Clothing Store', value:2}];
    }, 1200);
  };
  $scope.query = function(searchText) {
    if (searchText != "") {
      //Commented this to use async progress bar on autocomplete
      /*
      var promise = googleMapService.getAutoCompleteResult(searchText);
      promise.then(
        function(data){
          $scope.autoCompleteResults = data;
        },
        function(){
          console.log("Something went worng!");
        }
      );
      */
    } else {
      $scope.autoCompleteResults = null;
      $scope.selectedItemImageURLLg = null;
      $scope.selectedItemImageURLSm = null;
    }
  };

  $scope.getMapImageAndAddress = function(selectedItem) {
    if (selectedItem !== null) {
      var promiseAddress = googleMapService.getUserAddress(selectedItem);
      promiseAddress.then(
        function(data){
          $scope.selecteAddress = data;
        }
      );
      var promiseLg = googleMapService.getAddressMapImageLg(selectedItem);
      promiseLg.then(
        function(data){
          $scope.selectedItemImageURLLg = data;
        }
      );
      var promiseSm = googleMapService.getAddressMapImageSm(selectedItem);
      promiseSm.then(
        function(data){
          $scope.selectedItemImageURLSm = data;
        }
      );
    }
  };
});

app.directive('botTalk', [function(){
  return {
    restrict: 'A',
    templateUrl: '../templates/botTalk.template.html',
    replace: true,
    scope: {

    },
    link: function(scope, elem, attrs){

    }
  }
}]);

app.directive('helloBot', function($timeout) {
	return {
		link: function(scope, elem, attrs) {
			$timeout(function(){				
				scope.start1 = true;
			},900);

			$timeout(function(){
				scope.start2 = true;
			},1800);
					
			$timeout(function(){
				scope.typing = false;
				scope.start3 = true;
				scope.inputName = true;
				scope.inputNameOn = true;
			},2400);
		}
	}
});

app.directive('userName', function($timeout){
	return {
		link: function(scope, elem, attrs) {

			elem.bind("keydown keypress", function(event) {
				if(event.which === 13 || event.which === 9) {
					if(scope.cName !== "" && scope.cLastName !== "" && scope.cName !== undefined && scope.cLastName !== undefined) {
						scope.$apply(function() {
							scope.inputNameOn = false;
							scope.inputNameStatic= true;
							if(scope.hello1 === false){
	          	scope.typing = true;								
							}
	        	});
						$timeout(function(){			
							scope.hello1 = true;
						},1200);

						$timeout(function(){
							scope.typing = false;
							scope.hello2 = true;
              if(scope.showMap === false){
                scope.inputPlace = true;                
              }
						},1800);
					}
				}
				
			});
		}
	}
});

app.directive('inputPlace', ['googleMapService', '$timeout', function(googleMapService, $timeout){
	return {
		link: function(scope, elem, attrs){
			scope.$watch(function(){return scope.selectedItemImageURLLg;}, function(event){
				if(event !== null) {
          scope.showMap = true;
          scope.inputPlace = false;
          if(scope.createUser1 === false){
          	scope.typing = true;								
						$timeout(function(){			
							scope.createUser1 = true;
						},1200);
						$timeout(function(){
							scope.typing = false;
							scope.createUser2 = true;
              scope.inputInfoOn = true;
							scope.inputInfo = true;
						},1800);
          }
          scope.searchText = undefined;				
				}
		  });
	 }
	}
}]);

app.directive('inputInfo', function($timeout){
	return {
		link: function(scope, elem, attrs){
      elem.bind("keydown keypress", function(event) {
        if(event.which === 13 || event.which === 9) {
          if(scope.email !== null){
            if(scope.phone !== null){
              if(scope.password !== null){
                scope.inputInfoOn = false;                  
                scope.inputEmailStatic = true;   
                if(scope.congrats === false){
                  scope.typing = true;                
                  $timeout(function() {
                    scope.typing = false;
                    scope.congrats = true;
                  }, 1500);               
                }
              }
            }
          }
        }
      });
		}
	}
});

app.directive('scroll', function($window){
  return{
    link: function(scope, elem, attrs) {
      
    }
  }
});

app.directive('tryAgain', function(){
	return {
		link: function(scope, elem, attrs) {
			elem.on('mouseenter', function(){
				elem.css('cursor', 'pointer');
			});
			elem.bind('click', function(){
				scope.$apply(function(){
					if(elem[0].id === "appMap"){
						scope.inputPlace = true;
						scope.showMap = false;  
					} else if(elem[0].id === "userNameLg" || elem[0].id === "userNameSm"){
						scope.inputNameStatic= false;
						scope.inputNameOn = true;					
					} else if(elem[0].id === "inputInfoLg" || elem[0].id === "inputInfoSm"){
            scope.inputEmailStatic = false; 
            scope.inputInfoOn = true;                  
          }
				});
			});
		}
	}
});
