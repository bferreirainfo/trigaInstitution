'use strict';

trigaApp.controller('NotasCtrl', function($rootScope,$scope, NotasService, $ionicLoading, $timeout) {
	var firstime = true;
	function fetch(isPushToFrefresh){
		 if(!isPushToFrefresh){
			$("#contentAnimation1").hide();
			 if(firstime){
				$("#subHeader").addClass("subHeaderAnimationCondition");
				$("#contentAnimation1").addClass("contentAnimation1");
			 }
			 $timeout(function(){
				 $ionicLoading.show()
			 },100)
		 }
		 var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
		 NotasService.TodasNotas(studentId).then(
					function success(resp) {
						$(".slideUp1:eq(0)").hide();
						var response = { grades : resp, isUpdate : true , lastUpdateDate : new Date()};
						window.localStorage.setItem("grades", JSON.stringify(response));
						$timeout(function(){
							$scope.$broadcast('scroll.refreshComplete');
							$ionicLoading.hide();
						},550)
						$timeout(function(){
							
							$scope.dto = response;
							
						},560)
						$timeout(function(){
							 $(".slideUp1:eq(0)").fadeIn(1000);
							$("#subHeader").animate({
						            'top': '64px',
						            }, {duration: 'slow', queue: false}).fadeIn(1700);
							if(isPushToFrefresh || !firstime){
								 $("#contentAnimation1").show();
							}else{
								$("#contentAnimation1").animate({
									'top': '41px',
								}, {duration: 'slow', queue: false}).fadeIn(1000);
								$("#contentAnimation1").removeClass("contentAnimation1");
								firstime = false;
							}
						    $("#subHeader").removeClass("subHeaderAnimationCondition");
							
						 },580)
				},  function error(resp){
						console.log("fecthing GRADES error response", resp)
						console.log("error retrive grades: "+ JSON.stringify(resp));
						$ionicLoading.hide();
						$scope.$broadcast('scroll.refreshComplete');
				});
	}
	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
		if(states.stateName == "menu.notas"){
			$rootScope.sideMenuController.canDragContent(false);
//			$('.appHeader').removeClass("shadowed");
			fetch();
        }
	});
	$scope.fetch = fetch;
})
trigaApp.controller('EnviarMensagemCtrl', function ($rootScope,$scope,InformationService, SendMessageService,  $ionicLoading,$timeout, $ionicSlideBoxDelegate) {
//	ionic.Platform.showStatusBar(true);
	var firstime = true;
	$scope.selectedProfessor = null;
	$scope.selectedsChairs = null;
	$scope.isStepOneDisable = true;
	
	$scope.slide = function(index){
		$ionicSlideBoxDelegate.slide(index);
	}
	
	
	$scope.loadTeachers = function() {
		return InformationService.getAllProfessors().then(
				function success(resp) {
					$scope.dto.teachers = resp;
				},function success(resp) {
				});
		 
	}
	
	$scope.loadFilters = function() {
		$scope.dto.filters = [{name: "Para toda a instituição", value: 1},{ name: "Para turmas de um professor" , value: 2}, {name: "Para alunos" , value: 3 },
		                      { name: "Cursos" , value: 4}];
	}
	
	$scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
      };
	
	$scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    
    $scope.sendMessage = function () {
    	var data = {institutionName : JSON.parse(window.localStorage.getItem("appConfig")).instituionName, 
    				filter: $scope.dto.selectedFilter.value, 
    				classesIds: $scope.dto.selectedClasses, 
    				studentsIds: $scope.dto.selectedStudents,
    				coursesIds: $scope.dto.selectedCourses,
    				channels: $scope.dto.channels,
    				title: $scope.dto.title,
    				message: $scope.dto.message};
    	console.log($scope.dto.selectedStudents)
    	SendMessageService.send(data).then(
				function success(resp) {
					$scope.dto.showResultTab = true;
					$scope.events.trigger("render", 2);
					$ionicSlideBoxDelegate.enableSlide(false);
				},  function error(resp){
					 console.log("error retrive scheduleGrid: "+ JSON.stringify(resp));
					 $ionicLoading.hide();
					 $scope.$broadcast('scroll.refreshComplete');
			})
    	
    };
    
    $scope.clear = function () {
    	$scope.dto = {selectedFilter : null ,
			 	   selectedProfessor : null , 
			 	   classes : [],
			 	   selectedClasses : [], 
			 	   teachers: null,
			 	   selectedTeacher: null,
			 	   students: [],
			 	   selectedStudents: [],
			 	   courses : [],
			 	   selectedCourses:[],
			 	   isStepOneDisable : true, 
			 	   showWhereTab: false, 
			 	   showConfirmTab: false, 
			 	   showResultTab: false, 
			 	   canSend: false, 
			 	   isStepTwoDisable: true,
			 	   channels: ['Push Notification'],
			 	   pushNotification: true,
			 	   title: "",
			 	   message: "",
	 			  };
    	$scope.slide(0);
    	$ionicSlideBoxDelegate.enableSlide(true);
    };
	
     
    
      
	function fetch(){
		 $("#contentAnimation").hide();
		 if(firstime){
			 $("#subHeader1").addClass("subHeaderAnimationCondition");
			 $("#contentAnimation").addClass("contentAnimation");
		 }
		 $ionicLoading.show()
		var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
		
					$timeout(function(){
						$scope.$broadcast('scroll.refreshComplete');
						$ionicLoading.hide();
					},350)
					$timeout(function(){
						 $scope.clear();
						 $scope.events.trigger("render");
						 $scope.$watch('dto.selectedFilter' , function (filter){
							 if(filter){
								 
								 switch (filter.value) {
									case 1:
										$scope.dto.showWhereTab = true;
										$scope.events.trigger("render");
										break;
									case 2:
										 if($scope.dto.selectedClasses.length > 0){
											 $scope.dto.showWhereTab = true;
											 $scope.events.trigger("render");
										 }else{
											 $scope.dto.showWhereTab = false;
										 }
										break;
									case 3:
										 if($scope.dto.selectedStudents.length > 0){
											 $scope.dto.showWhereTab = true;
											 $scope.events.trigger("render");
										 }else{
											 $scope.dto.showWhereTab = false;
											 $scope.events.trigger("render");
										 }
										InformationService.getAllStudents().then(
												function success(resp) {
													$scope.dto.students = resp;
												},function success(resp) {
												});
										break;
									case 4:
										if($scope.dto.selectedCourses.length > 0){
											 $scope.dto.showWhereTab = true;
											 $scope.events.trigger("render");
										 }else{
											 $scope.dto.showWhereTab = false;
										 }
										InformationService.getAllCourses().then(
												function success(resp) {
													$scope.dto.courses = resp;
												},function success(resp) {
												});
										break;
		
									default:
										console.log("default")
										$scope.dto.showWhereTab = false;
										break;
									}
							 }
						 });
						 $scope.$watch('dto.selectedTeacher' , function (newValue){
							 if($scope.dto.selectedTeacher){
								 $scope.dto.selectedClasses = [];
								 InformationService.getAllClassesByProfessorId($scope.dto.selectedTeacher.id).then(function sucess(resp){
									 $scope.dto.classes = resp;
								 }, function error(resp){
									 
								 });
							 }
						 });
						 $scope.$watchCollection('dto.selectedClasses' , function (newValue){
							 if($scope.dto.selectedClasses.length > 0){
								 $scope.dto.showWhereTab = true;
								 $scope.events.trigger("render");
							 }else{
								 $scope.dto.showWhereTab = false;
							 }
						 });
						 $scope.$watchCollection('dto.selectedStudents' , function (newValue){
							 if($scope.dto.selectedStudents.length > 0){
								 $scope.dto.showWhereTab = true;
								 $scope.events.trigger("render");
							 }else{
								 $scope.dto.showWhereTab = false;
							 }
						 });
						 $scope.$watchCollection('dto.selectedCourses' , function (newValue){
							 if($scope.dto.selectedCourses.length > 0){
								 $scope.dto.showWhereTab = true;
								 $scope.events.trigger("render");
							 }else{
								 $scope.dto.showWhereTab = false;
							 }
						 });
						 
						 $scope.$watch('[dto.pushNotification, dto.title, dto.message]' , function (newValue){
							 if($scope.dto.pushNotification && $scope.dto.title.length > 0 && $scope.dto.message.length > 0 && $scope.dto.message.length < 150){
								 $scope.dto.canSend = true;
								 $scope.events.trigger("render");
							 }else{
								 $scope.dto.canSend = false;
							 }
						 });
						 
						 
						 
						 $("#subHeader1").animate({
					            'top': '64px',
					            }, {duration: 'slow', queue: false}).fadeIn(1200);
						 if(!firstime){
							 $("#contentAnimation").show();
							 $(".slideUp").hide();
							 $(".slideUp").fadeIn(700);
						 }else{
							 $("#contentAnimation").animate({
								 'top': '128px',
							 }, {duration: 'slow', queue: false}).fadeIn(1000);
							 $("#contentAnimation").removeClass("contentAnimation");
							 firstime = false;
						 }
						 $("#subHeader1").removeClass("subHeaderAnimationCondition");
					},370)
	}
	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
        if(states.stateName == "menu.EnviarMensagem") {
        	$rootScope.sideMenuController.canDragContent(false);
        	$('.appHeader').removeClass("shadowed");
        	fetch();
        }
	});
	$scope.fetch = fetch;
	$scope.updateFn = fetch;
})

trigaApp.controller('LoginCtrl', function($scope, $state, $mdDialog,$mdToast, $timeout, $ionicHistory, LoginService, PushNotificationService) {
	 $scope.username = null; 
	 $scope.password = null;	 
	 $scope.selectedInstitution = null;
	 $scope.institutions = [{value: "TRIGA" , name :"TRIGA(TESTE)"}, {value: "ALQUIMIA", name:"ALQUIMIA "}];
	 if(!isProd){			 
  		$scope.username = "diretor@triga.com";
  		$scope.password = "123";
  		$scope.selectedInstitution = {value: "TRIGA" , name :"TRIGA(TESTE)"};
	  }
		
	  $scope.show = false;
	  $scope.signIn = function(ev,username,password,selectedInstitution) {
		  	// Appending dialog to document.body to cover sidenav in docs app
		    // Modal dialogs should fully cover application
		    // to prevent interaction outside of dialog
			$mdDialog.show(
				      $mdDialog.alert()
				        .title('Efetuando login.')
				        .content('Aguarde um momento...')
				        .targetEvent(ev)
				    );
			  LoginService.login(username,password,selectedInstitution.value).then(
					  function success(resp) {
						  $mdDialog.hide();
						  if(isNotEmpty(resp.data)){
							  console.log("login response: ", resp);
							  window.localStorage.setItem("appConfig", JSON.stringify(resp.data.appConfig));
							  window.localStorage.setItem("studentPerfil", JSON.stringify(resp.data.perfil));

							  //
							  //registerNewDevice + teste notification
							  if(ionic.Platform.isWebView())
								  pushNotificationRegister.initialize(PushNotificationService);
							  $ionicHistory.nextViewOptions({
								  disableAnimate: true,
								  disableBack: true
							  });
							  
							  
							  //
//							  if(ionic.Platform.isWebView()){
//							  var institutionName = resp.appConfig.instituionName.toLowerCase();
//							  var url = "http://trigaportal-trigaserver.rhcloud.com/institutionsLogos/institutionSmallIcon/" + institutionName + '_small_icon.png';
//							  var fileDir = cordova.file.dataDirectory;
//							  var fileName = 'institution_small_icon.png'
//							  var targetPath = fileDir + fileName;
							  
//							  window.resolveLocalFileSystemURL(targetPath, console.log("starting verification"), function downloadAsset() {
//								var fileTransfer = new FileTransfer();
//								fileTransfer.download(url, targetPath, 
//									function(entry) {
//										console.log("Success!");
//										console.log("file downloaded")
//									}, 
//									function(err) {
//										console.log("Error");
//										console.dir(err);
//									});
////							  });
//							  }
							  $state.go('menu.'+ resp.data.appConfig.defaultPage);
						  }else{
							  $timeout(function(){
								  $mdToast.show($mdToast.simple()
									        .content('Email ou senha incorretos')
									        .position("bottom right")
									        .hideDelay(1000));
							  },400)
						  }
					  }, function error(resp){
						  $mdDialog.hide();
						  $mdToast.show(
							      $mdToast.simple()
							        .content(resp.errorMessage.title + ". " + resp.errorMessage.description)
							        .position("bottom right")
							        .hideDelay(1000)
							    );
					});
	  };
})
trigaApp.controller('loadingDataCtrl', function($scope, $state, $timeout, LoginService) {
	if(ionic.Platform.isWebView() &&  false == window.localStorage.getItem("testDone")){
		  $timeout(function(){
			  var testInitialConditions = "iniciando \nregiGCM " + window.localStorage.getItem("regiGCM") + "\ndeviceId " + window.localStorage.getItem("deviceId");
			  $scope.regiGCM = JSON.parse(window.localStorage.getItem("regiGCM"));
			  if($scope.regiGCM == null || !$scope.regiGCM.pass){
				  $scope.testResult = JSON.parse($scope.regiGCM);
			  }else{
				  $timeout(function(){
					  $scope.deviceId = JSON.parse(window.localStorage.getItem("deviceId"));
					  if($scope.deviceId == null || !$scope.deviceId.pass){
						  $scope.testResult = JSON.parse($scope.deviceId);
					  }else{
						  $timeout(function(){
							  if(window.localStorage.getItem("unsawNotficiations")){
								  $scope.testResult = { pass : true , content : null};
								  window.localStorage.setItem("testDone", true);
						  	      $state.go('menu.notas');
							  }else{
								  window.localStorage.setItem("testDone", true);
								  $scope.testResult = { pass : false , content : "notification not received" };
							  }
						  },2000);
					  }
				  },100);
			  }
		  },1000);
	  }else{
		  $state.go('menu.notas');
	  }
})


trigaApp.controller('TeacherReviewCtrl', function ($scope,$ionicSideMenuDelegate) {
	 $scope.data = {
	    group1 : '',
	    group2 : '2'
	  };
	  $scope.radioData = [
	    { label: '1', value: '1' },
	    { label: '2', value: '2' },
	    { label: '3', value: '3', isDisabled: true },
	    { label: '4', value: '4' }
	  ];
	  $scope.addItem = function() {
	    var r = Math.ceil(Math.random() * 1000);
	    $scope.radioData.push({ label: r, value: r });
	  };
	  $scope.removeItem = function() {
	    $scope.radioData.pop();
	  };
})
trigaApp.controller('NotificationsCtrl', function($rootScope,$scope, $mdDialog, $timeout) {
	$scope.showAlert = function(ev) {
	    // Appending dialog to document.body to cover sidenav in docs app
	    // Modal dialogs should fully cover application
	    // to prevent interaction outside of dialog
	    $mdDialog.show(
	    		
	      $mdDialog.confirm()
	        .title('Deseja deletar todas as notificações?')
	        .content('Todas as notificações serão removidas para todo o sempre e não pode ser desfeito.')
	        .ariaLabel('Alert Dialog Demo')
	        .ok('Deletar!')
	        .cancel('Deixa pra lá!')
	        .targetEvent(ev)
	    ).then(function() {
	    	window.localStorage.removeItem("storedNotifications");
	    	$timeout(function(){
	    		var notificationListElement = document.getElementById("notificationList");
   			 if(null != notificationListElement){
   				 var storedNotificationsScope = angular.element(notificationListElement).scope();
   					 storedNotificationsScope.$apply(function(){
   						 storedNotificationsScope.storedNotifications = null;
   					 });
   			 }
			},0)
	    }, function() {
	    	//
	    });;
	  };
	$scope.$on( "$ionicView.enter", function( scopes, states) {
		var fileDir = ionic.Platform.isWebView() ? cordova.file.dataDirectory : "img/";
		var fileName = ionic.Platform.isWebView() ? 'institution_small_icon.png': "triga3.jpg"
		var targetPath = fileDir + fileName;
		$scope.institutionIcon = targetPath;
		if( states.stateName == "menu.notifications" ) {
			
			$rootScope.sideMenuController.canDragContent(true);
//			$('.appHeader').addClass("shadowed");
			window.localStorage.removeItem("unsawNotficiations");
			$timeout(function(){
			var storedNotifications = JSON.parse(window.localStorage.getItem("storedNotifications"));
			if(!ionic.Platform.isWebView())
			storedNotifications = [{ title : 'seja bem vindo ao triga', message: 'Se você recebeu essa mensagem significa que seu dispositivo está pronto para receber notificações da instituição.', date: '10/3', notificaitonType: 'TRIGA'},
			                              { title : 'Não haverá aula', message: 'Não haverá aula hoje', date: '10/3', notificaitonType: 'INSTITUTION'},
			                              { title : 'seja bem vindo ao triga', message: '', date: '10/3', notificaitonType:'GRADE_NOTIFICATION'}]
			var notificationListElement = document.getElementById("notificationList");
  			 if(null != notificationListElement){
  				 var storedNotificationsScope = angular.element(notificationListElement).scope();
  					 storedNotificationsScope.$apply(function(){
  						 storedNotificationsScope.storedNotifications = storedNotifications;
  					 });
  			 }
			
			},0)
			
		};
	});
})

trigaApp.controller('UnsawNotficiationsPopoverCtrl', function($scope, $ionicPopover, $timeout) {
	$timeout(function(){
		$scope.unsawNotficiations = JSON.parse(window.localStorage.getItem("unsawNotficiations")) || [];
		$scope.unsawNotficiationsSize =  $scope.unsawNotficiations.length;
	},1000)
	
	$scope.dto = {top: ionic.Platform.isWebView() ? '35px' : '0px'};
	$ionicPopover.fromTemplateUrl('views/popover.html',{scope:$scope}).then(function(popover) {
		$scope.popover = popover;
  });
	$scope.closePopover = function() {
		    $scope.popover.hide();
	};
	
	$scope.openPopover = function($event){
		$scope.popover.show($event)
		$scope.unsawNotficiationsSize = 0;
		window.localStorage.removeItem("unsawNotficiations");
	}
})

trigaApp.controller('UserCtrl', function($scope, UserPerfilService) {
	var studentPerfil = JSON.parse(window.localStorage.getItem("studentPerfil"));
	if(studentPerfil){
		$scope.name = studentPerfil.name;
		$scope.currenctUserType = studentPerfil.currenctUserType;
	}else{
		UserPerfilService.getPerfil("124").then(function(resp) {
			$scope.name = resp.name;
			$scope.course = resp.course;
		});
	}
})

trigaApp.controller('ChooseInstitutionCtrl', function($scope, LoginService) {
	$scope.choose = function(institutionName){
		LoginService.setInstitution(institutionName);
    }
})

trigaApp.controller('MenuCtrl', function($scope, $location,$window) {
	var studentPerfil = JSON.parse(window.localStorage.getItem("studentPerfil"));
	var appConfig = JSON.parse(window.localStorage.getItem("appConfig"));
	$scope.logout = function(){
		window.localStorage.clear();
		$location.path("/login");
		$window.location.reload();
	}
	switch (studentPerfil.currenctUserType) {
		case "Diretor":
			$scope.showSendMessage =  appConfig.directorFuncionalities.funcionalities.indexOf('SENDMESSAGE') > -1;
			break;
		case "Coordenador":
			$scope.showSendMessage =  appConfig.coordenatorFuncionalities.funcionalities.indexOf('SENDMESSAGE') > -1;
			break;
		case "Professor":
			$scope.showSendMessage =  appConfig.professorFuncionalities.funcionalities.indexOf('SENDMESSAGE') > -1;
			break;
		default:
			break;
	}
})

function isNotEmpty(obj){
	for(var key in obj) {
		  if(obj.hasOwnProperty(key)) return true
	}
	return false;
}
