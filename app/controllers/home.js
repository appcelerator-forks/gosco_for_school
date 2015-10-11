var args = arguments[0] || {}; 
COMMON.construct($); 
var u_id = Ti.App.Properties.getString('u_id');  
var userModel = Alloy.createCollection('user'); 
var educationModel = Alloy.createCollection('education'); 
var user;
init();
 
function init(){
	user = userModel.getUserById(u_id);
	var education = educationModel.getSchoolById(Ti.App.Properties.getString('e_id'));
	$.welcomeUser.text = user.fullname+ " / "+ education.name; 
	$.thumbPreview.image = education.img_path;
	
	if(user.role != "headmaster" ){
		$.staffView.height = 0;
		$.staffView.top = 0;
		$.staffView.bottom = 0;
	}
	
	if(user.role != "teacher" ){
		$.homeworkView.height = 0;
		$.homeworkView.top = 0;
		$.homeworkView.bottom = 0;
	}
}

function logoutAction(){ 
	var dialog = Ti.UI.createAlertDialog({
	    cancel: 0,
	    buttonNames: ['Cancel','Confirm'],
	    message: 'Would you like to logout?',
	    title: 'Logout account'
	});
	dialog.addEventListener('click', function(e){  
		if (e.index === e.source.cancel){
	      //Do nothing
	    }
	    if (e.index === 1){
	    	//Do logout  
			doLogout();
	    }
	});
	dialog.show(); 
}
 

function doLogout(){
	COMMON.showLoading();
	var param = {  
		"session" : Ti.App.Properties.getString('session')
	};
	API.callByPost({url:"doLogoutUrl", params: param}, function(responseText){
		COMMON.hideLoading();
		var res = JSON.parse(responseText);
		 
		if(res.status == "error"){ 
			COMMON.resultPopUp("Error",res.data[0]);
			return false;
		}else{  
			//set session 
			Ti.App.Properties.removeProperty('session');
			$.win.close();
			Alloy.Globals.Navigator.open("login");
			return false; 
		}
		 
	}, function(){
		COMMON.hideLoading();
		COMMON.createAlert("Connection Fail","Something wrong with internet connection interact with server. Please try again later.");
	});
}

function navWindow(e){
	var target = e.source.mod;  
	Alloy.Globals.Navigator.open(target);
}

if(OS_ANDROID){
	$.win.addEventListener('android:back', function (e) {
		logoutAction(); 
	});
}

Ti.App.addEventListener('refreshData', init); 
