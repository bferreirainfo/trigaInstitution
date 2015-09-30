function isNotEmpty(obj){
	for(var key in obj) {
		  if(obj.hasOwnProperty(key)) return true
	}
	return false;
}

function zeroFill( number, width ){
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}

function isMobile(){
  var isIPad = ionic.Platform.isIPad();
  var isIOS = ionic.Platform.isIOS();
  var isAndroid = ionic.Platform.isAndroid();
  var isWindowsPhone = ionic.Platform.isWindowsPhone();
  return (isIPad || isIOS || isAndroid || isWindowsPhone);
}

function isNative(){
	if(typeof cordova != 'undefined')
		return true;
	else
		return false;
}

function getItem(key){
	return JSON.parse(window.localStorage.getItem(key));
}
function save(key,item){
	return window.localStorage.setItem(key, JSON.stringify(item));
}

function getFunctionalities(){
	
	var appConfig = getItem("appConfig");
	var perfil = getItem("studentPerfil");
	
	switch (perfil.currenctUserType) {
		case "director":
			return appConfig.directorConfig;
		case "coordenator":
			return  appConfig.coordenatorConfig;
		case "professor":
			return  appConfig.professorConfig;
		default:
			break;
	}
}


function translate(text){
	var languageDictionary = getItem("languageDictionary");
	return languageDictionary[text];
}

function getLabels(listOfKeys){
	var labels = [];
	console.log("listOfKeys: ",listOfKeys)
	for (var key in listOfKeys) {
		var item = listOfKeys[key];
		labels.push({"key": item, value : translate(item)});
	}
	return labels;
}

function getItem(key){
	return JSON.parse(window.localStorage.getItem(key));
}


function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += obj[p];
        }
    }
    return str;
}
    