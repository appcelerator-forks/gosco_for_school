var args = arguments[0] || {};
COMMON.construct($); 
function save(){
	var currentPassword = $.currentPassword.value;
	var newPassword = $.newPassword.value;
	var confirmPassword = $.confirmPassword.value;
	if(currentPassword.trim() == "" ){
		COMMON.createAlert("Error","Please fill in your current password");
		return false;
	}
	
	if(newPassword.trim() == "" ){
		COMMON.createAlert("Error","Please fill in new password");
		return false;
	}
	
	if(newPassword.trim() != confirmPassword.trim() ){
		COMMON.createAlert("Error","New password mismatch with confirm password");
		return false;
	}
	
	var param = { 
		"oldPassword"	  : currentPassword.trim(),
		"newPassword"	  : newPassword.trim(),
		"session" : Ti.App.Properties.getString('session')
	};
	
	COMMON.showLoading();
	API.callByPost({url:"updatePasswordUrl", params: param}, function(responseText){
		COMMON.hideLoading();
		var res = JSON.parse(responseText);
		if(res.status == "error"){ 
			COMMON.createAlert("Error",res.data);
			return false;
		}else{ 
			COMMON.createAlert("Success","Password updated successfully");
			closeWindow();
		}
		
	});
}

function closeWindow(){
	$.win.close();
}