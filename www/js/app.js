'use strict';
/* App Module */
var trigaApp = angular.module('trigaApp', ['ionic','ngResource','ngMaterial','tabSlideBox']);
trigaApp.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default').primaryPalette("orange").accentPalette("green");
	 $mdThemingProvider.theme('docs-dark').primaryPalette('orange').dark();
});

trigaApp.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
	    .state('chooseInstitution', {
	    	url: "/chooseInstitution",
	    	templateUrl: "views/chooseInstitution.html",
	    	controller: "ChooseInstitutionCtrl"
	    })
	    .state('login', {
	    	url: "/login",
	    	templateUrl: "views/login.html",
	    	controller: "LoginCtrl"
	    })
        .state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "views/home.html"

        })
        .state('menu.EnviarMensagem', {
            url: "/EnviarMensagem",
            views: {
                'menuContent' :{
                    templateUrl: "views/EnviarMensagem.html",
                    controller: "EnviarMensagemCtrl"
                }
            }
        })
	    .state('menu.notifications', {
	    	url: "/notifications",
	    	views: {
	    		'menuContent' :{
	    			templateUrl: "views/notifications.html",
	    			controller: "NotificationsCtrl"
	    		}
	    	}
	    }) 
	    .state('menu.detailNotification', {
	    	url: "/detailNotification",
	    	views: {
	    		'menuContent' :{
	    			templateUrl: "views/detailNotification.html",
	    			controller: "DetailNotificationCtrl"
	    		}
	    	},
	    	params: {detailNotification: null }
	    }) 
})

//trigaApp.config(function($httpProvider,$ionicConfigProvider) {
//	  //config ionic
//	  // note that you can also chain configs
//	  $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
//	
//	  //config loading screen spinner
//	  $httpProvider.interceptors.push(function($rootScope) {
//	    return {
//	      request: function(config) {
//	        $rootScope.$broadcast('loading:show')
//	        return config
//	      },
//	      response: function(response) {
//	    	 alert(JSON.stringify(response));
//	        $rootScope.$broadcast('loading:hide')
//	        return response
//	      }
//	    }
//	  })
//	})
//trigaApp.run(function($rootScope, $ionicLoading,$timeout) {
	
//  $rootScope.$on('loading:show', function() {
//    $ionicLoading.show({template: '<md-progress-circular md-mode="indeterminate"></md-progress-circular>', noBackdrop: true})
//	  window.plugins.spinnerDialog.show();
//  })

//  $rootScope.$on('loading:hide', function() {
//	  $timeout(function(){
//		  window.plugins.spinnerDialog.hide();
//	  },200);
//  })
//})
trigaApp.constant('$ionicLoadingConfig', {template: '<svg class="spinner-container" style="width:65px;height:65px;" viewBox="0 0 44 44" data-reactid=".0.1.0"><circle class="path" cx="22" cy="22" r="20" fill="none" stroke-width="4" data-reactid=".0.1.0.0"></circle></svg>', noBackdrop: true});
trigaApp.config(function($ionicConfigProvider) {
	ionic.Platform.isFullScreen = true;
	if(isNative()){
		$ionicConfigProvider.scrolling.jsScrolling(false);
//		ionic.keyboard.enable();
		
	}
});
var isProd;
//window.addEventListener('native.keyboardshow', function (e) {
//    var deviceHeight = window.innerHeight;
//    var keyboardHeight = e.keyboardHeight;
//    var deviceHeightAdjusted = deviceHeight - keyboardHeight;//device height adjusted
//    deviceHeightAdjusted = deviceHeightAdjusted < 0 ? (deviceHeightAdjusted * -1) : deviceHeightAdjusted;//only positive number
//    document.getElementById('page').style.height = deviceHeightAdjusted + 'px';//set page height
//    document.getElementById('page').setAttribute('keyBoardHeight', keyboardHeight);//save keyboard height
//});
trigaApp.run(function($ionicSideMenuDelegate,PushNotificationService, $location,$timeout,$rootScope) {
	isProd = true;
	ionic.Platform.ready(function(){
		
		var isUserAllReadyLogged= window.localStorage.getItem("studentPerfil") != null;
		var waitForPushPluginInitialize = false;
		
		if(ionic.Platform.isWebView() && isUserAllReadyLogged){
			//initiate pushNotificationService to analize if the app was a "coldStart" opening
			//coldstart means that app was closed and the user opened it by click on notification in notification  bar.
			waitForPushPluginInitialize = true;
			pushNotificationRegister.initialize(PushNotificationService);
		}
		
		///this plugin lock the orientation for all screens to only portrait |º|
		if(ionic.Platform.isWebView()){
			screen.lockOrientation('portrait');
			if (window.cordova && window.cordova.plugins.Keyboard) {
			    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			    cordova.plugins.Keyboard.disableScroll(false);
			  }
			 statusbarTransparent.enable();
		     // Get the bar back
		     StatusBar.show();
		}
		//
		$timeout(function(){
			var startType;
			if(isColdStart){
				startType ="coldStart";
			}else if(isProd && window.localStorage.getItem("studentPerfil")){
				startType = "defaultPage"
			}else{
				startType = "firstTime";
			}
			switch(startType){
				case "coldStart":	
					$location.path("/menu/notifications");
					break;
				case "defaultPage":
					 $location.path("/menu/" + JSON.parse(window.localStorage.getItem("appConfig")).defaultPage);
//					$location.path("/menu/notifications");
					break;
				case "firstTime": 
					$location.path("/login");
					break;
			}
			if(ionic.Platform.isWebView()){
				$timeout(function(){
					navigator.splashscreen.hide();
				}, 1000);
			}
			
		}, waitForPushPluginInitialize ? 1000 : 0 );	
	});
	
    // Menu button
    $rootScope.sideMenuController = $ionicSideMenuDelegate;
})


