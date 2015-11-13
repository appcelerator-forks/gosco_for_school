var args = arguments[0] || {};

var isCurriculum = args.isCurriculum || "";
var id = args.id || "";
var formType = args.formType || "1";
var postDetails;
var curDate = currentDateTime();  
COMMON.construct($); 

init();

function init(){
	if(isCurriculum != ""){
	 	postModel = Alloy.createCollection('curriculumPost');  
	}else{
		postModel = Alloy.createCollection('post');  
	}
	
	if(id != ""){
		postDetails = postModel.getRecordsById(id); 
		formType	= postDetails.type;
		if(postDetails.type == 2){
			$.win.title = "Award Form";
			$.postDetailsBtn.title = "Award Details";
		}
		
		if(postDetails.type == 2){
			$.win.title = "Award Form";
			$.postDetailsBtn.title = "Award Details";
			$.tvrPublicGlobal.height= 0;
		}
		
		if(isCurriculum != ""){
			$.win.title = "Curriculum Announcement Form";
			$.postDetailsBtn.title = "Curriculum Posted Details";
		}
		$.title.value   = postDetails.title;
		//$.message.value = postDetails.message;
		
		$.publish_date.text = timeFormat(postDetails.publish_date);
		$.expired_date.text = timeFormat(postDetails.expired_date); 
		if(postDetails.status == 1){ 
			$.statusSwitch.value = true;
		}
		if(postDetails.e_id == ""){ 
			$.publishGlobal.value = true;
		}
		
	}else{
		if(formType== 2){
			$.win.title = "Award Form";
			$.postDetailsBtn.title = "Award Details";
			$.tvrPublicGlobal.height= 0;
		}
		$.postDetailsBtn.visible =false;
	}
	
	
}

function save(){
	var title = $.title.value;
	//var message = $.message.value;
	var status = $.statusSwitch.value;
	var publishGlobal = $.publishGlobal.value;
	var publish_date = convertToDBDateFormat($.publish_date.text);
	var expired_date = convertToDBDateFormat($.expired_date.text);
	
	if(status == false){
		status = 2;
	}else{
		status = 1;
	}
	 
	if((id == "") || (title != postDetails.title) || (publish_date != postDetails.publish_date) || 
	(expired_date != postDetails.expired_date) || (status != postDetails.status)){
		if(isCurriculum != ""){
			var param = {
				id    : id,
				c_id  : isCurriculum,
				title : title,
				message : "",//message,
				type  : formType,
				publish_date  : publish_date,
				expired_date  : expired_date,
				status        : status,
				session : Ti.App.Properties.getString('session')
			}; 
			   	 
			API.callByPost({url:"updateCurriculumPost", params: param}, function(responseText){
				var res = JSON.parse(responseText);  
				if(res.status == "success"){   
					postModel.addPost(res.data);  
					//Ti.App.fireEvent('refreshPostList');   
					if(id == ""){
						id = res.data[0]['id'];
						goToDetails();
					}
					$.saveBtn.visible = false;
					COMMON.resultPopUp("Saved", "Curriculum post successfully updated"); 
				}else{
					$.win.close();
					COMMON.hideLoading();
					Alloy.Globals.Navigator.open("login");
					COMMON.resultPopUp("Session Expired", res.data); 
				}
			});
		}else{
			var eid = Ti.App.Properties.getString('e_id');
			if(formType == 1){
				if(publishGlobal == true){
					eid = "";
				}
			}
			
			var param = {
				id    : id,
				e_id  : eid,
				title : title,
				message : "",//message,
				type  : formType,
				publish_date  : publish_date,
				expired_date  : expired_date,
				status        : status,
				session : Ti.App.Properties.getString('session')
			}; 
			 
			API.callByPost({url:"updatePost", params: param}, function(responseText){
				var res = JSON.parse(responseText);  
				if(res.status == "success"){   
					postModel.addPost(res.data);  
					//Ti.App.fireEvent('refreshPostList');   
					if(id == ""){
						id = res.data[0]['id'];
						goToDetails();
					}
					$.saveBtn.visible = false;
					COMMON.resultPopUp("Saved", "Information successfully updated"); 
				}else{
					$.win.close();
					COMMON.hideLoading();
					Alloy.Globals.Navigator.open("login");
					COMMON.resultPopUp("Session Expired", res.data); 
				}
			});
		}
		
	} 
	
}

function goToDetails(){ 
	Alloy.Globals.Navigator.open('formElement',{id: id, isCurriculum : isCurriculum});  
}

function hideKeyboard(){
	$.title.blur();
	//$.message.blur();
}

function changePublishDate(e){  
	$.publish_date.text = dateConvert(e.value); 
}

function changeExpiredDate(e){ 
	$.expired_date.text = dateConvert(e.value); 
}

function changeStatus(e){
	 
} 

function changeDate(e){ 
	  
	var pickerdate = e.value; 
	var res_pd = pd.split('-'); 
	
    var day = pickerdate.getDate();
    day = day.toString();
 
    if (day.length < 2) {
        day = '0' + day;
    }
  
    var month = pickerdate.getMonth();
    month = month + 1;
    month = month.toString();
 
    if (month.length < 2) {
        month = '0' + month;
    }
 
    var year = pickerdate.getFullYear(); 
    selDate = day + "/" + month + "/" + year; 
     
	$.date_value.text = selDate ;  
}

function closeWindow(){
	Ti.App.fireEvent('refreshPost');  
	$.win.close();
}

function hideDatePicker(){
	$.dateExpiredPicker.visible = false;
	$.datePublishPicker.visible = false;
	$.dateToolbar.visible = false;
	$.selectorView.height = 0;
}

function showPublishPicker(){ 
	if(OS_ANDROID){ 
		var pd = curDate.substr(0, 10); 
		if(id != ""){
			pd =  postDetails.publish_date;
		}
		var res_pd = pd.split('-'); 
		  
		var datePicker = Ti.UI.createPicker({
			  type: Ti.UI.PICKER_TYPE_DATE,
			  minDate: new Date(res_pd[0],parseInt(res_pd[1])-1,res_pd[2]), 
			  id: "datePicker",
			  visible: false
		});
		
		if(res_pd[1] == "08"){
			res_pd[1] = "8";
		}
		if(res_pd[1] == "09"){
			res_pd[1] = "9";
		}
		
		datePicker.showDatePickerDialog({
			value: new Date(res_pd[0],parseInt(res_pd[1])-1,res_pd[2]), 
			callback: function(e) {
			if (e.cancel) { 
				} else {
					 
					var today = new Date();
					today = today.setDate(today.getDate() - 1); 
				    if(e.value < today){
				    	COMMON.resultPopUp("Fail", "You cannot select past date"); 
				    	return false;
				    }else{
				    	changePublishDate(e);
				    }  
				}
			}
		});
	}else{   
		$.dateExpiredPicker.visible = false;
		$.datePublishPicker.visible = true;
		$.selectorView.height = Ti.UI.SIZE;
		$.dateToolbar.visible = true;
	} 
	
	hideKeyboard();
}
 
 
function showExpiredPicker(){ 
	if(OS_ANDROID){  
		var ed = curDate.substr(0, 10); 
		if(id != ""){
			ed =  postDetails.expired_date;
		}
		var res_ed = ed.split('-');
		if(res_ed[1] == "08"){
			res_ed[1] = "8";
		}
		if(res_ed[1] == "09"){
			res_ed[1] = "9";
		}
		var datePicker = Ti.UI.createPicker({
			  type: Ti.UI.PICKER_TYPE_DATE,
			 // minDate: new Date(1930,0,1),
			  id: "datePicker",
			  visible: false
		});
		datePicker.showDatePickerDialog({
			value: new Date(res_ed[0],parseInt(res_ed[1])-1,res_ed[2]),
			callback: function(e) {
			if (e.cancel) { 
				} else {
					var today = new Date();
					today = today.setDate(today.getDate() - 1); 
				    if(e.value < today){
				    	COMMON.resultPopUp("Fail", "You cannot select past date"); 
				    	return false;
				    }else{
				    	changeExpiredDate(e);
				    }  
				 
				}
			}
		});
	}else{  
		$.datePublishPicker.visible = false;
		$.dateExpiredPicker.visible = true;
		$.dateToolbar.visible = true;
		$.selectorView.height = Ti.UI.SIZE;
	} 
	
	hideKeyboard();
}
