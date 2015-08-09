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


function isMobile(){
  var isIPad = ionic.Platform.isIPad();
  var isIOS = ionic.Platform.isIOS();
  var isAndroid = ionic.Platform.isAndroid();
  var isWindowsPhone = ionic.Platform.isWindowsPhone();
  return isIPad || isIOS || isAndroid || isWindowsPhone;
}

function isNative(){
	if(typeof cordova != 'undefined')
		return true;
	else
		return false;
}