/*********************
*** SETTING / API ***
**********************/
var API_DOMAIN = "admin.goscoglobal.com";

// APP authenticate user and key
var USER  = 'gosco';
var KEY   = '206b53047cf312532294f7207789fdggh';

//API when app loading phase
var getSchoolPost		= "http://"+API_DOMAIN+"/api/getPostList?user="+USER+"&key="+KEY+"&auth";
var getCurriculumPost	= "http://"+API_DOMAIN+"/api/getAdminCurriculumPostList?user="+USER+"&key="+KEY+"&auth";

var getBannerList  		= "http://"+API_DOMAIN+"/api/getBannerList?user="+USER+"&key="+KEY;
var getCurriculumList  	= "http://"+API_DOMAIN+"/api/getCurriculumList?user="+USER+"&key="+KEY+"&auth";
var getHomeworkList 	= "http://"+API_DOMAIN+"/api/getAdminHomeworkList?user="+USER+"&key="+KEY+"&auth";
var getSchoolClassList  = "http://"+API_DOMAIN+"/api/getSchoolClassList?user="+USER+"&key="+KEY+"&auth";
var addHomeworkUrl   	= "http://"+API_DOMAIN+"/api/addHomework?user="+USER+"&key="+KEY+"&auth";
var uploadHomeworkAttachmentUrl = "http://"+API_DOMAIN+"/api/uploadHomeworkAttachment?user="+USER+"&key="+KEY+"&auth";
var getEventsList       = "http://"+API_DOMAIN+"/api/getEventsList?user="+USER+"&key="+KEY+"&auth";
//var getTuitionList   	= "http://"+API_DOMAIN+"/api/getTuitionList?user="+USER+"&key="+KEY;  
var deviceInfoUrl       = "http://"+API_DOMAIN+"/api/getDeviceInfo?user="+USER+"&key="+KEY;
var uploadCurriculumLogoUrl = "http://"+API_DOMAIN+"/api/uploadCurriculumLogo?user="+USER+"&key="+KEY+"&auth";
 
var uploadEventAttachmentUrl = "http://"+API_DOMAIN+"/api/uploadEventAttachment?user="+USER+"&key="+KEY+"&auth";
var doLoginUrl  		= "http://"+API_DOMAIN+"/api/loginAdmin?user="+USER+"&key="+KEY;
var doLogoutUrl			= "http://"+API_DOMAIN+"/api/logoutAdmin?user="+USER+"&key="+KEY;
var getSchoolList  		= "http://"+API_DOMAIN+"/api/getSchoolList?user="+USER+"&key="+KEY+"&auth";
var updatePasswordUrl  	= "http://"+API_DOMAIN+"/api/updatePasswordAdmin?user="+USER+"&key="+KEY+"&auth";
var updateProfileUrl  	= "http://"+API_DOMAIN+"/api/updateAdminProfile?user="+USER+"&key="+KEY+"&auth"; 
var getAdminSchList  	= "http://"+API_DOMAIN+"/api/getAdminSchoolList?user="+USER+"&key="+KEY+"&auth";
var updatePost			= "http://"+API_DOMAIN+"/api/updatePost?user="+USER+"&key="+KEY+"&auth";
var updateSchoolUrl     = "http://"+API_DOMAIN+"/api/editSchoolInformation?user="+USER+"&key="+KEY+"&auth";
var addElementUrl		= "http://"+API_DOMAIN+"/api/addElement?user="+USER+"&key="+KEY+"&auth";
var updateElementUrl    = "http://"+API_DOMAIN+"/api/updateElement?user="+USER+"&key="+KEY+"&auth";
var deleteElementUrl    = "http://"+API_DOMAIN+"/api/deleteElement?user="+USER+"&key="+KEY+"&auth";
var deletePostUrl    	= "http://"+API_DOMAIN+"/api/deletePost?user="+USER+"&key="+KEY+"&auth";
var deleteAttachmentUrl = "http://"+API_DOMAIN+"/api/deleteAttachment?user="+USER+"&key="+KEY+"&auth";
var addUpdateEventUrl   = "http://"+API_DOMAIN+"/api/updateEvent?user="+USER+"&key="+KEY+"&auth"; 
var updateCurriculumPost = "http://"+API_DOMAIN+"/api/updateCurriculumPost?user="+USER+"&key="+KEY+"&auth"; 
var getStaffListUrl     = "http://"+API_DOMAIN+"/api/getStaffList?user="+USER+"&key="+KEY+"&auth";
var addUpdateStaffUrl   = "http://"+API_DOMAIN+"/api/updateAdminProfile?user="+USER+"&key="+KEY+"&auth"; 
var addUpdateCurriculumUrl = "http://"+API_DOMAIN+"/api/addUpdateCurriculum?user="+USER+"&key="+KEY+"&auth"; 
//API that call in sequence 
var APILoadingList = [
	{url: getSchoolList, model: "education", checkId: "1"},
	{url: getBannerList, model: "banner", checkId: "2"}, 
];

/*********************
**** API FUNCTION*****
**********************/ 
exports.callByPostImage = function(e, onload, getParam){
	var url =  eval(e.url); 
	var _result = contactServerByPostImage(url, e.params || {});   
	_result.onload = function(e) {   
		onload && onload(this.responseText); 
	};
		
	_result.onerror = function(e) { 
		onerror && onerror(); 
	};	
};
 
 
exports.callByPost = function(e, onload, onerror){
	var url =  eval(e.url);
	//console.log(url);
	var _result = contactServerByPost(url, e.params || {});   
	_result.onload = function(e) {   
		onload && onload(this.responseText); 
	};
		
	_result.onerror = function(e) { 
		onerror && onerror(); 
	};	
};
 
exports.loadRemoteImage = function (obj,url) {
	var xhr = Titanium.Network.createHTTPClient();

	xhr.onload = function() { 
	 obj.image=this.responseData; 
	}; 
	xhr.open('GET',url); 
	xhr.send();
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
	 //	client.setRequestHeader('Content-Type','multipart/form-data'); 
	 }
    
	client.open("POST", url); 
	
	//client.setRequestHeader('Content-Type', 'application/json');   
	client.send(records);
	return client;
};

function contactServerByPostImage(url,records) {  
	var client = Ti.Network.createHTTPClient({
		timeout : 50000
	});
  	 
    
	client.open("POST", url);     
	console.log(records);
	client.send( records);
	return client;
};

function onErrorCallback(e) { 
	// Handle your errors in here
	COMMON.createAlert("Error", e);
};