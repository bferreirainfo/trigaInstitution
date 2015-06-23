'use strict';
/* App Module */
var trigaApp = angular.module('trigaApp', ['ionic','ngResource','ngMaterial','tabSlideBox']);
trigaApp.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default').primaryPalette("orange").accentPalette("green");
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
        .state('menu.teacherReview', {
        	url: "/teacherReview",
        	views: {
        		'menuContent' :{
        			templateUrl: "views/teacherReview.html",
        			controller: "TeacherReviewCtrl"
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
//	  $ionicConfigProvider.views.maxCache(0);
});
var isProd;
trigaApp.run(function($ionicSideMenuDelegate,PushNotificationService, $location,$timeout,$rootScope) {
	isProd = true;
	FastClick.attach(document.body);
	ionic.Platform.ready(function(){
//		document.body.style.height = screen.availHeight + 'px';
		var isUserAllReadyLogged= window.localStorage.getItem("studentPerfil") != null;
		var waitForPushPluginInitialize = false;
		
		if(ionic.Platform.isWebView() && isUserAllReadyLogged){
			//initiate pushNotificationService to analize if the app was a "coldStart" openning
			//coldstart means that app was closed and the user opened it by click on notification in notification  bar.
			waitForPushPluginInitialize = true;
			pushNotificationRegister.initialize(PushNotificationService);
		}
		
		///this plugin lock the orientation for all screens to only portrait |º|
		if(ionic.Platform.isWebView())
			screen.lockOrientation('portrait');
		
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
//					$location.path("/menu/quadroDeHorarios");
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



// window.addEventListener('native.showkeyboard', keyboardShowHandler);
//
//		    // native.showkeyboard callback
//		    // e contains keyboard height
//		    function keyboardShowHandler(e) {
//		        // get viewport heightenquan
//		    		var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
//		    		// get the maximum allowed height without the need to scroll the page up/down
//		    		var scrollLimit = viewportHeight - (document.activeElement.offsetHeight + document.activeElement.offsetTop);
//		    		
//		    		// if the keyboard height is bigger than the maximum allowed height
////		        if (e.keyboardHeight > scrollLimit) {
//		    		// calculate the Y distance
//		    		var scrollYDistance = document.activeElement.offsetHeight + (e.keyboardHeight - scrollLimit);
//		    		// animate using move.min.js (CSS3 animations)
////		    		move(document.body).to(0, -scrollYDistance).duration('.2s').ease('in-out').end();
////		        }
//		    }
//		    window.addEventListener('native.hidekeyboard', keyboardHideHandler);
//
//		    // native.hidekeyboard callback
//		    function keyboardHideHandler() {
//		        // remove focus from activeElement 
//		        // which is naturally an input since the nativekeyboard is hiding
//		        document.activeElement.blur();
//		        // animate using move.min.js (CSS3 animations)
//		        move(document.body).to(0, 0).duration('.1s').ease('in-out').end();
//		    }