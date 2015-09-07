'use strict';
var devLocalUrl = "http://192.168.25.3:8080/trigaportal/trigaMobile/aluno/"
var devWebInstitutionUrl = "http://trigaportal-trigaserver.rhcloud.com/trigaMobile/institution/"
var devLocalInstitutionUrl = "http://192.168.25.3:8080/trigaportal/trigaMobile/institution/"
var devWebUrl= "http://trigaportal-trigaserver.rhcloud.com/trigaMobile/aluno/"
var isLocal = true;
var apiUrl = isLocal ? devLocalInstitutionUrl : devWebInstitutionUrl;
var devInstitutionUrl = isLocal ? devLocalInstitutionUrl : devWebInstitutionUrl;

//trigaApp.factory("TrigaPortalWS", functi on ($resource,$rootScope) {
//    return $resource(
//        'http://trigaportal-trigaserver.rhcloud.com/trigaMobile/aluno/:action?alunoId=:alunoId&instituicao=:instituicao', { action: "notas", alunoId: '10', instituicao: 'alquimia'}, {
//        update: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
//            method: 'PUT'
//        },
//        get: {
//            method: 'GET',
//            // This is what I tried.
//            interceptor: {
//                response: function (resp) {
//                    return resp.data;
//                },
//                responseError: function (err) {
//                    console.log('error in interceptor', err);
//                }
//            },
//            isArray: true
//        }
//    }
//
//    );
//});
/* Services */

var timeoutError = -2;
var noConnectionError = -1;
var lastTimeCached = {};

trigaApp.service('SendMessageService', function($q,$resource) {
    return {
    	send: function(data) {
    		data.institutionName = JSON.parse(window.localStorage.getItem("appConfig")).institutionName;
    		data.autor = JSON.parse(window.localStorage.getItem("studentPerfil")).name;
    		data.userType = JSON.parse(window.localStorage.getItem("studentPerfil")).currenctUserType;
    		var regResource = $resource(devInstitutionUrl+ ':action',
	    								   { action: "sendMessage"}, 
	    								   { 'post':  {method: 'POST',
	    									   		   headers:{'Content-Type' : 'application/json;'}
	    								   			  }
	    								   			  
	    								   } 
    								   );
    		var q = $q.defer();
    		fecthData(q,regResource, 'post',null, null, data);
            return q.promise;
        }	
    }
})
trigaApp.service('MonitorNotificationService', function($q,$resource) {
	return {
		searchNotifications: function(data) {
			data.institutionName = JSON.parse(window.localStorage.getItem("appConfig")).institutionName;
			var regResource = $resource(devInstitutionUrl+ ':action',
					{ action: "searchNotifications"}, 
					{ 'post':  {method: 'POST',
						headers:{'Content-Type' : 'application/json;'}
					}
					
					} 
			);
			var q = $q.defer();
			fecthData(q,regResource, 'post',null, null, data);
			return q.promise;
		}	
	}
})

trigaApp.service('InformationService', function($q,$resource) {
	return {
		getAllProfessors: function() {
			var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).institutionName;
			var regResource = $resource(devInstitutionUrl+ ':action?institutionName=:institutionName',
					{ action: "getAllProfessors", institutionName: institutionName}, 
					{ 'getAllProfessors':  {method: 'GET'}
					
					} 
			);
			var q = $q.defer();
			fecthData(q,regResource, 'get');
			return q.promise;
		},	
		getAllClassesByProfessorId: function(professorId) {
			var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).institutionName;
			var regResource = $resource(devInstitutionUrl+ ':action?institutionName=:institutionName&professorId=:professorId',
					{ action: "getAllClassesByProfessorId", institutionName: institutionName, professorId : professorId}, 
					{ 'getAllClassesByProfessorId':  {method: 'GET'}
					
					} 
			);
			var q = $q.defer();
			fecthData(q,regResource, 'get');
			return q.promise;
		},
		getAllStudents: function() {
			var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).institutionName;
			var regResource = $resource(devInstitutionUrl+ ':action?institutionName=:institutionName',
					{ action: "getAllStudents", institutionName: institutionName}, 
					{ 'getAllStudents':  {method: 'GET'}
					
					} 
			);
			var q = $q.defer();
			fecthData(q,regResource, 'get');
			return q.promise;
		},
		getAllCourses: function() {
			var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).institutionName;
			var regResource = $resource(devInstitutionUrl+ ':action?institutionName=:institutionName',
					{ action: "getAllCourses", institutionName: institutionName}, 
					{ 'getAllCourses':  {method: 'GET'}
					
					} 
			);
			var q = $q.defer();
			fecthData(q,regResource, 'get');
			return q.promise;
		}	
	}
})


trigaApp.service('PushNotificationService', function($q,$resource) {
    return {
    	saveDeviceKeyInServer: function(devicePushNotificationKey) {
    		var studentId = JSON.parse(window.localStorage.getItem("studentPerfil")).id;
    		var institutionName = JSON.parse(window.localStorage.getItem("appConfig")).institutionName;
    		var regResource = $resource(apiUrl+ ':action?studentId=:studentId&institution=:institution&devicePushNotificationKey=:devicePushNotificationKey&deviceUUID=:deviceUUID&deviceModel=:deviceModel&devicePlatform=:devicePlatform&deviceVersion=:deviceVersion',
    								   { action: "saveDeviceKey", studentId: studentId,  institution: institutionName, devicePushNotificationKey : devicePushNotificationKey, deviceUUID : device.uuid, deviceModel : device.model , devicePlatform: device.platform, deviceVersion: device.version }, { 'get':  {method: 'GET', isArray : false} });
            var q = $q.defer();
            regResource.get(function(resp) {
            	removePromiseProperties(resp);
                q.resolve(resp);
            }, function(err) { 
                q.reject(err);
            })
            return q.promise;
        },	
        updateDeviceKeyInServer: function(deviceId,deviceKey) {
        	var updateResource = $resource(apiUrl+':action?alunoId=:alunoId&instituicao=:instituicao&deviceKey=:deviceKey',
        								  {action:"updateDeviceKey",alunoId: 19,instituicao:"padrao", 'deviceKey':deviceKey }, { 'get':  {method: 'GET', isArray : false} });
        	var q = $q.defer();
        	updateResource.get(function(resp) {
        		q.resolve(resp);
        	}, function(err) { 
        		q.reject(err);
        	})
        	return q.promise;
        }
    }
})



trigaApp.service('UserPerfilService', function($q,$resource) {
	return {
		getPerfil: function(studentId) {
			var resource = $resource(apiUrl+':action?studentId='+studentId+'&instituicao=alquimia',{ action: "perfil"}, { 'get':  {method: 'GET'} });
			var q = $q.defer();
			fecthData(q,resource, 'get');
			return q.promise;
		}
	
	}
})

//trigaApp.service('DetailNotificationService', function($q,$resource) {
//	return {
//		getPerfil: function(studentId) {
//			var resource = $resource(apiUrl+':action?studentId='+studentId+'&instituicao=alquimia',{ action: "perfil"}, { 'get':  {method: 'GET'} });
//			var q = $q.defer();
//			fecthData(q,resource, 'get');
//			return q.promise;
//		}
//	
//	}
//})

trigaApp.service('LoginService', function($q,$resource) {
	return {
		login: function(username, password,institutionName) {
			var resource = $resource(apiUrl+':action?username=:username&password=:password&institution=:institution',{ action: "login", username: username, password : password, institution: institutionName }, { get:  {method: 'GET'} });
			var q = $q.defer();
			fecthData(q,resource, 'get');
			return q.promise;
		},
	}
})


function isCacheExpired(serviceName){
	var expired = false;
	var lastTime = lastTimeCached[serviceName];
	if(lastTime){
		
		var diff = new Date() -  lastTime;
		var minutes = Math.floor((diff/1000)/60);
		if( minutes >= 1){
			expired = true;
		}
		
	}else {
		expired = true;
	}
	return expired;
}



function fecthData(qDefered,resource,methodName,storageKey, tries,data){
	if(connectionStatus()){
		var isFirstTime = tries == null;
		isFirstTime ? tries = 1 : tries++;
		//this method above tries to fetch the data based on the resource and methodName
		console.log("REQUEST",data)
		resource[methodName](data,function(resp) {
	    	removePromiseProperties(resp);
	    	console.log("RESPONSE " + JSON.stringify(resp));
	    	if(resp.status != null){
	    		if(storageKey){
	    			resp.lastUpdateDate = new Date();
	    			window.localStorage.setItem(storageKey, JSON.stringify(resp));
	    		}
	    		qDefered.resolve(resp);
	    	}else if(tries == 3){
	    			var err = {cache : null, status: null, errorMessage: null};
	    			if(storageKey)
	    			err.cache = JSON.parse(window.localStorage.getItem(storageKey));
	    			err.status = noConnectionError;
	    			err.errorMessage = {title: "Não foi possível conectar" , description: "Verifique sua conexão e tente novamente.", lastU0pdateDate: err.cache ? err.cache.lastUpdateDate : "nunca atualizado"};
	    			qDefered.reject(err);
    		}else{
    			fecthData(qDefered,resource,methodName,storageKey,tries,data);
    		}
	    }, function(err) {
	    	var isTimeOutError = err.status == 0 && err.data == null;
	    	if(isTimeOutError){
	    		console.log("Tentativas" + tries)
	    		if(tries == 3){
	    			if(storageKey)
	    			err.cache = JSON.parse(window.localStorage.getItem(storageKey));
	    			err.status = timeoutError;
	    			err.errorMessage = {title: "Demora na resposta" , description: "Tente novamente mais tarde.", lastUpdateDate: err.cache ? err.cache.lastUpdateDate : "nunca atualizado"};
	    			qDefered.reject(err);
	    		}else{
	    			fecthData(qDefered,resource,methodName,storageKey,tries,data);
	    		}
	    	}
	    })
	}else{
		var err = {cache : null, status: null, errorMessage: null};
		err.cache = JSON.parse(window.localStorage.getItem(storageKey));
		err.status = noConnectionError;
		err.errorMessage = {title: "Sem conexão com a internet" , description: "Verifique se ah uma conexão válida e tente novamente.", lastUpdateDate: err.cache ? err.cache.lastUpdateDate : "nunca atualizado"};
		qDefered.reject(err);
	}
}

function removePromiseProperties(resp){
	var promise = "$promise";
	var resolved = "$resolved";
	resp["$promise"] = null;
	resp["$resolved"] = null;
	delete resp["$promise"];
	delete resp["$resolved"];
}
function connectionStatus(){
	if(ionic.Platform.isWebView()){
		 var networkState = navigator.connection.type;
		 var states = {};
	    states[Connection.UNKNOWN]  = 'Unknown connection';
	    states[Connection.ETHERNET] = 'Ethernet connection';
	    states[Connection.WIFI]     = 'WiFi connection';
	    states[Connection.CELL_2G]  = 'Cell 2G connection';
	    states[Connection.CELL_3G]  = 'Cell 3G connection';
	    states[Connection.CELL_4G]  = 'Cell 4G connection';
	    states[Connection.CELL]     = 'Cell generic connection';
	    states[Connection.NONE]     = 'No network connection';
	    
	    return states[networkState] != 'No network connection';
	 }else{
		 return true;
	 }
}


