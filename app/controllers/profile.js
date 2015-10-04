var args = arguments[0] || {};
var userModel = Alloy.createCollection('user'); 
COMMON.construct($); 
init();

function init(){
	var user = userModel.getUserById(Ti.App.Properties.getString('u_id')); 
	$.username.value = user.username;
	$.fullname.value = user.fullname;
	$.email.value    = user.email;
	$.contact.value  = user.mobile;
	$.roles.value    = user.role;
	$.position.value = user.position; 
	$.last_updated.text = "Last Updated @ "+ timeFormat(user.updated);
}

function save(){
	COMMON.showLoading();
	var username = $.username.value;
	var fullname = $.fullname.value;
	var email = $.email.value;
	var contact = $.contact.value;
	var position = $.position.value;
	
	var param = { 
		"fullname": $.fullname.value,
		"username": $.username.value,
		"email"	  : email,
		"position": position,
		"mobile"  : contact,
		"role"	  : $.roles.value,
		"session" : Ti.App.Properties.getString('session')
	};
 
	API.callByPost({url:"updateProfileUrl", params: param}, function(responseText){
		COMMON.hideLoading();
		var res = JSON.parse(responseText);
		
		if(res.status == "error"){
			COMMON.hideLoading(); 
			COMMON.createAlert("Error",res.data[0]);
			return false;
		}else{ 
			var userModel = Alloy.createCollection('user'); 
			userModel.saveArray(res.data);
			COMMON.createAlert("Success","Profile updated successfully"); 
		}
		
	});
}

function closeWindow(){
	$.win.close();
}

$.tvrPassword.addEventListener('click', function(){
	Alloy.Globals.Navigator.open("changePassword");
});

$.tvrSchool.addEventListener('click', function(){
	Alloy.Globals.Navigator.open("mySchool");
});

$.tvrSubject.addEventListener('click', function(){
	Alloy.Globals.Navigator.open("subjectList");
});