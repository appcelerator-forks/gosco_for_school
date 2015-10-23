var args = arguments[0] || {};
var id = args.id || "";
var userModel = Alloy.createCollection('user'); 
var details;
var staffStatus;
COMMON.construct($); 

init();

function init(){
	Alloy.Globals.StaffRoles.push("Cancel"); 
	Alloy.Globals.StaffStatus.push("Cancel"); 
	if(id != ""){
		details = userModel.getUserById(id);
		$.username.value = details.username;
		$.fullname.value = details.fullname;
		$.mobile.value = details.mobile;
		$.email.value = details.email;
		staffStatus = details.status;
		$.status.text = Alloy.Globals.StaffStatus[parseInt(staffStatus) - 1];
		$.roles.text = details.role;
		$.position.value = details.position;
		$.username.editable = false;
		$.ps_notice.visible = false;
		$.ps_notice.height = 0;
	} 
}

//
function save(){
	var username = $.username.value;
	var fullname = $.fullname.value;
	var mobile = $.mobile.value;
	var email = $.email.value;
	var position = $.position.value;
	var roles = $.roles.text;
	staffStatus;
	
	if(username.trim() == "" ){
		COMMON.resultPopUp("Error","Please fill in staff username");
		return false;
	}
	
	if(fullname.trim() == "" ){
		COMMON.resultPopUp("Error","Please fill in staff full name");
		return false;
	}
	
	if(email.trim() == "" ){
		COMMON.resultPopUp("Error","Please fill in staff email");
		return false;
	}else if(validateEmail(email) != "1"){
		common.createAlert("Error", "Please fill in an valid email");
		return false;	
	}
	 
	if(roles.trim() == "" ){
		COMMON.resultPopUp("Error","Please choose staff roles");
		return false;
	}
	
	COMMON.showLoading();
	var param = { 
		"id"       : id,
		"username" : username.trim(),
		"fullname" : fullname.trim(),
		"email"    : email.trim(), 
		"mobile"   : mobile.trim(), 
		"position" : position.trim(), 
		"role"     : roles, 
		"status"   : staffStatus, 
		"e_id"	  : Ti.App.Properties.getString('e_id'),
		"session" : Ti.App.Properties.getString('session') 
	};
 
	API.callByPost({url:"addUpdateStaffUrl", params: param}, function(responseText){ 
		var res = JSON.parse(responseText);  
		if(res.status == "error"){
			COMMON.hideLoading(); 
			COMMON.resultPopUp("Fail",res.data[0]);
			return false;
		}else{ 
			COMMON.hideLoading();  
			userModel.saveArray(res.data);
			COMMON.resultPopUp("Success", "Successfully saved staff information"); 
			return false; 
		}
		 
	}, function(){
		COMMON.hideLoading();
		COMMON.resultPopUp("Connection Fail","Something wrong with internet connection interact with server. Please try again later.");
	});
}

$.tvrRole.addEventListener('click', function(){
	
	var cancelBtn = Alloy.Globals.StaffRoles.length -1;
	var dialog = Ti.UI.createOptionDialog({
		  cancel: Alloy.Globals.StaffRoles.length -1,
		  options: Alloy.Globals.StaffRoles, 
		  title: 'Choose staff roles'
	});
		
	dialog.show();	 
	dialog.addEventListener("click", function(e){   
		if(cancelBtn != e.index){  
			$.roles.text = Alloy.Globals.StaffRoles[e.index];
		}
	});
});



$.tvrStatus.addEventListener('click', function(){
	var cancelBtn = Alloy.Globals.StaffStatus -1;
	var dialog = Ti.UI.createOptionDialog({
		  cancel: Alloy.Globals.StaffStatus.length -1,
		  options: Alloy.Globals.StaffStatus, 
		  title: 'Choose staff status'
	});
		
	dialog.show();	 
	dialog.addEventListener("click", function(e){   
		if(cancelBtn != e.index){  
			staffStatus = e.index; 
			$.status.text = Alloy.Globals.StaffStatus[e.index];
		}
	});
});

function closeWindow(){ 
	$.win.close();
}