var args = arguments[0] || {};
var id = args.id || "";
var eventsModel = Alloy.createCollection('events'); 
var details;
COMMON.construct($); 

init();

function init(){
	if(id != ""){
		details = eventsModel.getRecordsById(id);
		console.log(details);
		$.title.value = details.title;
		$.message.value = details.message;
		$.publish_date.text = timeFormat(details.started);
		$.expired_date.text = timeFormat(details.ended); 
		if(details.status == 1){ 
			$.statusSwitch.value = true;
		}
	}
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

function save(){
	var title = $.title.value;
	var message = $.message.value;
	var status = $.statusSwitch.value;
	var started = convertToDBDateFormat($.publish_date.text);
	var ended = convertToDBDateFormat($.expired_date.text);
	
	if(status == false){
		status = 2;
	}else{
		status = 1;
	}
	
	var param = { 
		"id" : id,
		"e_id" : Ti.App.Properties.getString('e_id'),
		"title" : title,
		"message" : message,
		"started" : started,
		"ended"	  : ended,
		"status"  : status,
		"session" : Ti.App.Properties.getString('session')
	}; 
			
	API.callByPost({url:"addUpdateEventUrl", params: param}, function(responseText){
		var res = JSON.parse(responseText);  
		if(res.status == "success"){   
			Ti.App.fireEvent('refreshPost');  
			if(id == ""){
				COMMON.resultPopUp("Create success","Successfully create event!");
			}else{
				COMMON.resultPopUp("Update success","Successfully update this event!");
			}
			 
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
	});
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

function closeWindow(){ 
	$.win.close();
}