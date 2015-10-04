var fullname;
var mobile;
var username; 

exports.checkAuth = function() {
	var u_id = Ti.App.Properties.getString('user_id'); 
	if(u_id == "" || u_id == null){
		var win = Alloy.createController("auth/login").getView();
    	openModal(win);
	} else { 
    	var win = Alloy.createController("homepage/index").getView(); 
    	openModal(win);
    } 
    
};