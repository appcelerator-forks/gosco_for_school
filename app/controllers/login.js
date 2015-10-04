var args = arguments[0] || {};
COMMON.construct($); 

function do_login(){
	
	var username = $.username.value;
	var password = $.password.value;
	
	if(username.trim() == "" ){
		COMMON.createAlert("Login Fail","Please fill in your username or email");
		return false;
	}
	
	if(password.trim() == "" ){
		COMMON.createAlert("Login Fail","Please fill in your password");
		return false;
	}
	
	COMMON.showLoading();
	var param = { 
		"username" : username.trim(),
		"password" : password.trim()
	};
	API.callByPost({url:"doLoginUrl", params: param}, function(responseText){
		
		var res = JSON.parse(responseText);
		 
		if(res.status == "error"){
			COMMON.hideLoading(); 
			COMMON.createAlert("Login Fail",res.data);
			return false;
		}else{ 
			COMMON.hideLoading(); 
			var userModel = Alloy.createCollection('user'); 
			userModel.saveArray(res.data);
			
			//set session
			Ti.App.Properties.setString('session', res.data.session);
			Ti.App.Properties.setString('u_id', res.data.id);
			
			//get admin/teacher school
			getSchoolList();
			
			$.password.value = "";
			$.win.close();
			Alloy.Globals.Navigator.open("home");
			return false; 
		}
		 
	}, function(){
		COMMON.hideLoading();
		COMMON.createAlert("Connection Fail","Something wrong with internet connection interact with server. Please try again later.");
	});
	
}

function getSchoolList(){
	var param = { 
		"session" : Ti.App.Properties.getString('session')
	};
	API.callByPost({url:"getAdminSchList", params: param}, function(responseText){
		COMMON.hideLoading();
		var res = JSON.parse(responseText); 
		if(res.status == "success"){
			var list = res.data; 
			var educationAdminModel = Alloy.createCollection('education_admin'); 
			educationAdminModel.saveArray(res.data);
			
			if(list.length > 0){
				list.forEach(function(entry) {
					var checker = Alloy.createCollection('updateChecker'); 
					var isUpdate = checker.getCheckerById(4, entry.e_id);
					var last_updated ="";
					 
					if(isUpdate != "" ){
						last_updated = isUpdate.updated;
					} 
					var param = { 
						"e_id"	  : entry.e_id,
						"last_updated" : last_updated,
						"session" : Ti.App.Properties.getString('session')
					};
					API.callByPost({url:"getSchoolClassList", params: param}, function(responseText){
						var result = JSON.parse(responseText); 
						var educationClassModel = Alloy.createCollection('education_class'); 
						var arr2 = result.data; 
					 
						educationClassModel.saveArray(arr2); 
						checker.updateModule(4,"schoolClass", COMMON.now(), entry.e_id);
					});
				});
				
			}
			if(list.length == 1){
				//set session
				Ti.App.Properties.setString('e_id', list[0].e_id);
			} 
		}
	});
}

if(OS_ANDROID){
	$.win.addEventListener('android:back', function (e) {
		var dialog = Ti.UI.createAlertDialog({
		    cancel: 0,
		    buttonNames: ['Cancel','Confirm'],
		    message: 'Would you like to close GOSCO?',
		    title: 'Exit Gosco'
		});
		dialog.addEventListener('click', function(e){  
			if (e.index === e.source.cancel){
		      //Do nothing
		    }
		    if (e.index === 1){
		    	//Close app  
				var activity = Titanium.Android.currentActivity;
				activity.finish();
		    }
		});
		dialog.show(); 
		
	});
}