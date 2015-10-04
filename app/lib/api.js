/*********************
*** SETTING / API ***
**********************/
var API_DOMAIN = "14.102.151.167";

// APP authenticate user and key
var USER  = 'gosco';
var KEY   = '206b53047cf312532294f7207789fdggh';

//API when app loading phase
var getSchoolPost		= "http://"+API_DOMAIN+"/gosco/api/getPostList?user="+USER+"&key="+KEY+"&auth";
var getCurriculumPost	= "http://"+API_DOMAIN+"/gosco/api/getAdminCurriculumPostList?user="+USER+"&key="+KEY+"&auth";

var getBannerList  		= "http://"+API_DOMAIN+"/gosco/api/getBannerList?user="+USER+"&key="+KEY;
var getCurriculumList  	= "http://"+API_DOMAIN+"/gosco/api/getCurriculumList?user="+USER+"&key="+KEY;
var getHomeworkList 	= "http://"+API_DOMAIN+"/gosco/api/getAdminHomeworkList?user="+USER+"&key="+KEY+"&auth";
var getSchoolClassList  = "http://"+API_DOMAIN+"/gosco/api/getSchoolClassList?user="+USER+"&key="+KEY+"&auth";
var addHomeworkUrl   	= "http://"+API_DOMAIN+"/gosco/api/addHomework?user="+USER+"&key="+KEY+"&auth";
var getEventsList       = "http://"+API_DOMAIN+"/gosco/api/getEventsList?user="+USER+"&key="+KEY+"&auth";
//var getTuitionList   	= "http://"+API_DOMAIN+"/gosco/api/getTuitionList?user="+USER+"&key="+KEY;  
var deviceInfoUrl       = "http://"+API_DOMAIN+"/gosco/api/getDeviceInfo?user="+USER+"&key="+KEY;
var doSignUpUrl  		= "http://"+API_DOMAIN+"/gosco/api/doSignUp?user="+USER+"&key="+KEY; 

var doLoginUrl  		= "http://"+API_DOMAIN+"/gosco/api/loginAdmin?user="+USER+"&key="+KEY;
var doLogoutUrl			= "http://"+API_DOMAIN+"/gosco/api/logoutAdmin?user="+USER+"&key="+KEY;
var getSchoolList  		= "http://"+API_DOMAIN+"/gosco/api/getSchoolList?user="+USER+"&key="+KEY;
var updatePasswordUrl  	= "http://"+API_DOMAIN+"/gosco/api/updatePasswordAdmin?user="+USER+"&key="+KEY+"&auth";
var updateProfileUrl  	= "http://"+API_DOMAIN+"/gosco/api/updateAdminProfile?user="+USER+"&key="+KEY+"&auth"; 
var getAdminSchList  	= "http://"+API_DOMAIN+"/gosco/api/getAdminSchoolList?user="+USER+"&key="+KEY+"&auth";
var updatePost			= "http://"+API_DOMAIN+"/gosco/api/updatePost?user="+USER+"&key="+KEY+"&auth";
var updateSchoolUrl     = "http://"+API_DOMAIN+"/gosco/api/editSchoolInformation?user="+USER+"&key="+KEY+"&auth";
var addElementUrl		= "http://"+API_DOMAIN+"/gosco/api/addElement?user="+USER+"&key="+KEY+"&auth";
var updateElementUrl    = "http://"+API_DOMAIN+"/gosco/api/updateElement?user="+USER+"&key="+KEY+"&auth";
var deleteElementUrl    = "http://"+API_DOMAIN+"/gosco/api/deleteElement?user="+USER+"&key="+KEY+"&auth";
//API that call in sequence 
var APILoadingList = [
	{url: getSchoolList, model: "education", checkId: "1"},
	{url: getBannerList, model: "banner", checkId: "2"}, 
];

/*********************
**** API FUNCTION*****
**********************/ 

exports.callByPost = function(e, onload, onerror){
	var url =  eval(e.url);
	console.log(url);
	var _result = contactServerByPost(url, e.params || {});   
	_result.onload = function(e) {   
		onload && onload(this.responseText); 
	};
		
	_result.onerror = function(e) { 
		onerror && onerror(); 
	};	
};
 
 
exports.getDomain = function(){
	return "http://"+API_DOMAIN+"/";	
};


/*********************
 * Private function***
 *********************/
function contactServer(url) { 
	var client = Ti.Network.createHTTPClient({
		timeout : 10000
	});
	client.open("POST", url);
	client.send(); 
	return client;
};

/*********************
 * Private function***
 *********************/
function contactServerByPost(url,records) {  
	var client = Ti.Network.createHTTPClient({
		timeout : 5000
	});
  	if(OS_ANDROID){
	 	client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
	 }
	client.open("POST", url); 
	//client.setRequestHeader('Content-Type', 'application/json');   
	client.send(records);
	return client;
};

function onErrorCallback(e) { 
	// Handle your errors in here
	COMMON.createAlert("Error", e);
};