var args = arguments[0] || {};
COMMON.construct($); 
var educationModel = Alloy.createCollection('education'); 
var school; 
init();

function init(){ 
	showList(); 
}

function showList(){
	school = educationModel.getSchoolById( Ti.App.Properties.getString('e_id'));
	 console.log(school);
	$.schoolName.text  = school.name;
	$.contact_no.value = school.contact_no;
	$.fax_no.value   = school.fax_no;
	$.email.value    = school.email;
	$.address.value    = school.address;
	$.website.value  = school.website;
	$.postcode.value = school.postcode;
	$.longitude.value = school.longitude;
	$.latitude.value = school.latitude;
	$.thumbPreview.image = school.img_path;
	
	var schoolLevelArr =  Alloy.Globals.SchoolLevel;
	$.schoolLevel.value = schoolLevelArr[parseInt(school.education_type) -1];
	
	var schoolTypeArr =  Alloy.Globals.SchoolType;
	$.schoolType.value = schoolTypeArr[parseInt(school.school_type) -1];
}

function save(){
	 
	var param = {
		id    : school.id,
		name  : school.name,
		level  : school.level,
		email  : $.email.value,
		contact_no : $.contact_no.value,
		fax_no : $.fax_no.value,
		education_type : school.education_type,
		school_type  : school.school_type,
		postcode  : $.postcode.value,
		address  : $.address.value,
		state  : school.state,
		longitude : $.longitude.value,
		latitude : $.latitude.value,
		website  : $.website.value,
		status  : school.status,
		session : Ti.App.Properties.getString('session')
	}; 
		 
	API.callByPost({url:"updateSchoolUrl", params: param}, function(responseText){
		var res = JSON.parse(responseText); 
	 
		if(res.status == "success"){  
		 	/**load new set of category from API**/
		 	var arr = res.data; 
		    educationModel.saveArray(arr);  
		    COMMON.createAlert("Saved", "Information successfully updated"); 
		} 
	});
}

function hideKeyboard(){
	$.address.blur(); 
}

function closeWindow(){ 
	$.win.close();
} 