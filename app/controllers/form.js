var args = arguments[0] || {};

var isCurriculum = args.isCurriculum || "";
var id = args.id || "";
var formType;
var postDetails;
COMMON.construct($); 

init();

function init(){
	if(isCurriculum == "1"){
	 	postModel = Alloy.createCollection('curriculumPost');  
	}else{
		postModel = Alloy.createCollection('post');  
	}
	
	if(id != ""){
		postDetails = postModel.getRecordsById(id); 
		formType	= postDetails.type;
		if(postDetails.type == 2){
			$.win.title = "Award Form";
			$.saveBtn.title = "Award Details";
		}
		$.title.value   = postDetails.title;
		$.message.value = postDetails.message;
		
		$.publish_date.text = timeFormat(postDetails.publish_date);
		$.expired_date.text = timeFormat(postDetails.expired_date); 
		if(postDetails.status == 1){ 
			$.statusSwitch.value = true;
		}
	}
	
	
}

function save(){
	var title = $.title.value;
	var message = $.message.value;
	var status = $.statusSwitch.value;
	var publish_date = convertToDBDateFormat($.publish_date.text);
	var expired_date = convertToDBDateFormat($.expired_date.text);
	
	if(status == false){
		status = 2;
	}else{
		status = 1;
	}
	
	 
	if((id == "") || (title != postDetails.title) || (message != postDetails.message) || (publish_date != postDetails.publish_date) || 
	(expired_date != postDetails.expired_date) || (status != postDetails.status)){
		var param = {
			id    : id,
			e_id  : Ti.App.Properties.getString('e_id'),
			title : title,
			message : message,
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
				COMMON.createAlert("Saved", "Information successfully updated"); 
			}else{
				$.win.close();
				COMMON.hideLoading();
				Alloy.Globals.Navigator.open("login");
				COMMON.createAlert("Session Expired", res.data); 
			}
		});
	} 
	
}

function goToDetails(){
	Alloy.Globals.Navigator.open('formElement',{id: id, isCurriculum : isCurriculum});  
}

function hideKeyboard(){
	$.title.blur();
	$.message.blur();
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
	$.dateExpiredPicker.visible = false;
	$.datePublishPicker.visible = true;
	$.selectorView.height = Ti.UI.SIZE;
	$.dateToolbar.visible = true;
}

function showExpiredPicker(){ 
	$.datePublishPicker.visible = false;
	$.dateExpiredPicker.visible = true;
	$.dateToolbar.visible = true;
	$.selectorView.height = Ti.UI.SIZE;
}
