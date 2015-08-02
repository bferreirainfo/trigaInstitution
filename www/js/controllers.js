'use strict';

trigaApp.controller('EnviarMensagemCtrl', function ($rootScope,$mdToast,$mdDialog, $scope,InformationService, SendMessageService,  $ionicLoading,$timeout, $ionicSlideBoxDelegate) {
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
					$scope.dto.teachers = resp.data;
				},function error(resp) {
					$mdToast.show(
						      $mdToast.simple()
						        .content(resp.errorMessage.title + "  " + resp.errorMessage.description)
						        .position("bottom right")
						        .hideDelay(1000)
						    );
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
    
    $scope.sendMessage = function (ev) {
    	var studentPerfil = JSON.parse(window.localStorage.getItem("studentPerfil"));
    	var data = {institutionName : JSON.parse(window.localStorage.getItem("appConfig")).instituionName, 
    				filter: $scope.dto.selectedFilter.value, 
    				classesIds: $scope.dto.selectedClasses, 
    				studentsIds: $scope.dto.selectedStudents,
    				coursesIds: $scope.dto.selectedCourses,
    				channels: $scope.dto.channels,
    				title: $scope.dto.title,
    				message: $scope.dto.message,
    				autor: studentPerfil.name};
    	$mdDialog.show(
			      $mdDialog.alert()
			        .title('Enviando mensagem.')
			        .content('Aguarde um momento...')
			        .targetEvent(ev)
			    );
    	SendMessageService.send(data).then(
				function success(resp) {
					$mdDialog.hide();
					console.log("send msg: ",resp);
					 $timeout(function(){
						if(resp.status == 'SUCCESSS'){
							$scope.dto.showResultTab = true;
							$scope.events.trigger("render", 2);
							$ionicSlideBoxDelegate.enableSlide(false);
						}else{
							 $mdToast.show(
								      $mdToast.simple()
								        .content(resp.errorMessage)
								        .position("bottom right")
								        .hideDelay(1000)
								    );
						}
					 },500);
					
				},  function error(resp){
					$mdDialog.hide();
					 $mdToast.show(
						      $mdToast.simple()
						        .content(resp.errorMessage.title + "  " + resp.errorMessage.description)
						        .position("bottom right")
						        .hideDelay(1000)
						    );
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
													$scope.dto.students = resp.data;
												},function error(resp) {
													$mdToast.show(
														      $mdToast.simple()
														        .content(resp.errorMessage.title + "  " + resp.errorMessage.description)
														        .position("bottom right")
														        .hideDelay(1000)
														    );
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
													$scope.dto.courses = resp.data;
												},function error(resp) {
													$mdToast.show(
														      $mdToast.simple()
														        .content(resp.errorMessage.title + "  " + resp.errorMessage.description)
														        .position("bottom right")
														        .hideDelay(1000)
														    );
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
									 $scope.dto.classes = resp.data;
								 }, function error(resp){
									 $mdToast.show(
										      $mdToast.simple()
										        .content(resp.errorMessage.title + "  " + resp.errorMessage.description)
										        .position("bottom right")
										        .hideDelay(1000)
										    );
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
	 $scope.institutions = [{value: "TRIGA" , name :"Triga"}, {value: "ALQUIMIA", name:"Alquimia "}];
	 if(!isProd){			 
  		$scope.username = "diretor@triga.com";
  		$scope.password = "123";
  		$scope.selectedInstitution = {value: "TRIGA" , name :"Triga"};
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
							  },400);
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
});

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
	};
});

trigaApp.controller('ChooseInstitutionCtrl', function($scope, LoginService) {
	$scope.choose = function(institutionName){
		LoginService.setInstitution(institutionName);
   };
});

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
});

trigaApp.controller('NotificationsCtrl', function($rootScope,$scope, $mdDialog, $timeout) {
	var firstime = true;
	
	//initial/end- date 
	var d = new Date();
 	d.setDate(d.getDate()-5);
	$scope.initialDate = d;
	$scope.endDate = new Date();
	
	//perfil vars
	$scope.querySearch = querySearch;
    $scope.allContacts = loadContacts();
    $scope.contacts = [];
    $scope.filterSelected = true;
    $scope.filtereNotifications = [];
    
    
    //names vars
    $scope.namesFilter = [];
    $scope.searchNotifications = searchNotifications;
    
    //detail notication vars
    $scope.detailNotification = null;
    $scope.setDetailNotification = function(notification){
    	$scope.detailNotification = notification;
    }
    $scope.$watchCollection('namesFilter' , function (newValue){
    	$scope.filtereNotifications = $scope.notifications.filter(function(notification){
    		var isNameFilterOk = false;
    		var isPerfilOk = false;
    		
    		//validating filter
    		if($scope.contacts.length == 0){
    			isPerfilOk = true;
    		}else{
    			var perfil = angular.lowercase(notification.perfil);
    			for (var i=0; i < $scope.contacts.length; i++) {
	    			if(perfil.indexOf($scope.contacts[i].name.toLowerCase()) != -1){
	    				isPerfilOk = true;
	    				break;
	    			}	
				};
    		}
    		//Validating name
    		if($scope.namesFilter.length == 0){
    			isNameFilterOk = true;
    		}else{
    			var autor = angular.lowercase(notification.autor);
	    		for (var i=0; i < $scope.namesFilter.length; i++) {
	    			if(autor.indexOf($scope.namesFilter[i].autor.toLowerCase()) != -1){
	    				isNameFilterOk = true;
	    				break;
	    			}	
				};
    		}
    		
			return isPerfilOk && isNameFilterOk;
    	});
	});
    
    $scope.add = function(contact){
		if(($scope.contacts.indexOf(contact) < 0))
			$scope.contacts.push(contact);
	}
	function searchNotifications (query) {
	  var lowercaseQuery = angular.lowercase(query);
      return $scope.filtereNotifications.filter(function(notification){
      		var autor = angular.lowercase(notification.autor);
      		return autor.indexOf(lowercaseQuery) != -1
      });
    }
	function querySearch (query) {
      var results = query ?
          $scope.allContacts.filter(createFilterFor(query)) : [];
      return results;
    }
	
	function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(contact) {
        return (contact._lowername.indexOf(lowercaseQuery) != -1);;
      };
    }
    
    function loadContacts() {
      $scope.contacts = [
        'Coordenador',
        'Professor',
        'Diretor',
        'Reitor',
      ];
      return $scope.contacts.map(function (c, index) {
        var cParts = c.split(' ');
        var contact = {
          name: c,
          email: Math.floor((Math.random() * 10) + 1) + " pessoas",
          image: 'img/triga3.jpg'
        };
        contact._lowername = contact.name.toLowerCase();
        return contact;
      });
    };
    
    
    
    
    
    $scope.$watchCollection('contacts' , function (newValue){
    	$scope.filtereNotifications = $scope.notifications.filter(function(notification){
    		var isNameFilterOk = false;
    		var isPerfilOk = false;
    		
    		//validating filter
    		if($scope.contacts.length == 0){
    			isPerfilOk = true;
    		}else{
    			var perfil = angular.lowercase(notification.perfil);
    			for (var i=0; i < $scope.contacts.length; i++) {
	    			if(perfil.indexOf($scope.contacts[i].name.toLowerCase()) != -1){
	    				isPerfilOk = true;
	    				break;
	    			}	
				};
    		}
    		//Validating name
    		if($scope.namesFilter.length == 0){
    			isNameFilterOk = true;
    		}else{
    			var autor = angular.lowercase(notification.autor);
	    		for (var i=0; i < $scope.namesFilter.length; i++) {
	    			if(autor.indexOf($scope.namesFilter[i].autor.toLowerCase()) != -1){
	    				isNameFilterOk = true;
	    				break;
	    			}	
				};
    		}
    		
			return isPerfilOk && isNameFilterOk;
    	});
	 });
	 
    $scope.$watchCollection('notifications' , function (el){
    	if(el.length > 0){
	    	// $scope.filtereNotifications = $scope.notifications.filter(function(newValue){
	    		// console.log(el, newValue)
	    		// return el.perfil.toLowerCase() == newValue[0].name.toLowerCase();
	    	// });
	    	// console.log("Filtered  ", $scope.filtereNotifications);
		}
	 });
    
	$scope.getAsHour = function(time){
		var notificationDate = new Date();
		notificationDate.setTime(time);
		return zeroFill(notificationDate.getHours(),2) + ':' + zeroFill(notificationDate.getMinutes(),2);
	}
	$scope.getAsDate = function(time){
		var notificationDate = new Date();
		notificationDate.setTime(time);
		return zeroFill(notificationDate.getDate(),2) + '/' + zeroFill((notificationDate.getMonth() + 1),2)  + '/' +  notificationDate.getFullYear();
	}
	
	$scope.formatDate = function(time){
		var notificationDate = new Date();
		notificationDate.setTime(time);
		var todayDate = new Date();
		var isTodayDate = (todayDate.toDateString() === notificationDate.toDateString());
		if(isTodayDate){
			return  zeroFill(notificationDate.getHours(),2) + ':' + zeroFill(notificationDate.getMinutes(),2);
		}else{
			return zeroFill(notificationDate.getDate(),2) + '/' + zeroFill((notificationDate.getMonth() + 1),2)  + '/' +  notificationDate.getFullYear();
		}
	};
	$scope.$on( "$ionicView.beforeEnter", function( scopes, states) {
		if( states.stateName == "menu.notifications" ) {
			// $('.appHeader').addClass("shadowed");
			var fileDir =  "img/";
			var fileName =  "triga3.jpg";
			var targetPath = fileDir + fileName;
			$scope.institutionIcon = targetPath;
			//if(!ionic.Platform.isWebView())
			$scope.notifications = [{ filter: { filterName : "Para turmas de um professor", professor: "Marcelo", classes: ["turma1", "turma2","turma2","turma2","turma2","turma2","turma2","turma2",]}, messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'seja bem vindo ao triga', perfil:"coordenador",  autor: 'coo1', message: 'Se você recebeu essa mensagem significa que seu dispositivo está pronto para receber notificações da instituição.', date: new Date().getTime(), notificaitonType: 'TRIGA'},
		                              {filter: { filterName : "Para alunos", students: ["aluno1", "aluno2","aluno3"]},messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'Não haverá aula',perfil:"coordenador",  autor: 'coo2r', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              {filter: { filterName : "Para cursos", courses: ["Administração", "Enfermagem","Direito"]},messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'Não haverá aula',perfil:"coordenador",  autor: 'coo3', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              {filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'Não haverá aula',perfil:"professor",  autor: 'Prof1', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              {filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'Não haverá aula',perfil:"professor",  autor: 'Prof2', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              {filter: { filterName : "Para toda a instituição"},messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'Não haverá aula',perfil:"professor",  autor: 'Prof3', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              {filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg",title : 'Não haverá aula',perfil:"professor",  autor: 'Prof4', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              {filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'Não haverá aula',perfil:"professor",  autor: 'Prof5', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              {filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'Não haverá aula',perfil:"professor",  autor: 'Prof6', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              {filter: { filterName : "Para toda a instituição"},messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'Não haverá aula',perfil:"professor",  autor: 'Prof6', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              {filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg", title : 'Não haverá aula',perfil:"professor",  autor: 'Prof6', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              { filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg",title : 'Não haverá aula',perfil:"diretor",  autor: 'Dir1', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              { filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg",title : 'Não haverá aula',perfil:"diretor",  autor: 'Dir2', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              { filter: { filterName : "Para toda a instituição"},messageAnalitics: {totalTargets: "10"}, image:"img/userWithoutPhoto.jpg",title : 'Não haverá aula',perfil:"diretor",  autor: 'Dir3', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              { filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"},image:"img/userWithoutPhoto.jpg",title : 'Não haverá aula',perfil:"diretor",  autor: 'Dir4', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              { filter: { filterName : "Para toda a instituição"}, messageAnalitics: {totalTargets: "10"},image:"img/userWithoutPhoto.jpg",title : 'Não haverá aula',perfil:"reitor",  autor: 'Rei', message: 'Não haverá aula hoje', date: new Date().getTime(), notificaitonType: 'INSTITUTION'},
		                              ]
		};
	});
})





function isNotEmpty(obj){
	for(var key in obj) {
		  if(obj.hasOwnProperty(key)) return true
	}
	return false;
}

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}

MdChipsCtrl.prototype.removeChipAndFocusInput = function (index) {
  this.removeChip(index);
  if(!isMobile){
	this.onFocus();
  }
};

function isMobile(){
  var isIPad = ionic.Platform.isIPad();
  var isIOS = ionic.Platform.isIOS();
  var isAndroid = ionic.Platform.isAndroid();
  var isWindowsPhone = ionic.Platform.isWindowsPhone();
  return isIPad || isIOS || isAndroid || isWindowsPhone;
}
