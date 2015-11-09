var args = arguments[0] || {};
var id = args.id || "";
var eventsModel = Alloy.createCollection('events'); 
var eventsAttachmentModel = Alloy.createCollection('eventsAttachment'); 
var details;
COMMON.construct($); 
var curDate = currentDateTime();   
init();

function init(){
	if(id != ""){
		details = eventsModel.getRecordsById(id); 
		$.title.value = details.title;
		$.message.value = details.message;
		$.publish_date.text = timeFormat(details.started);
		$.expired_date.text = timeFormat(details.ended); 
		if(details.status == 1){ 
			$.statusSwitch.value = true;
		}
		loadAttachment();
		
	}else{
		$.attView.visible = false;
		$.attView.height = 0;
	}
}

function loadAttachment(){
	var attList = eventsAttachmentModel.getRecordByEvents(id);  
	var counter = 0;
	 
	COMMON.removeAllChildren($.attachment);
	if(attList.length > 0){ 
	 	attList.forEach(function(att){  
	 		$.attachment.add(attachedPhoto(att.img_thumb, counter));
	 		counter++;  
	 	}); 
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
	
	if(OS_ANDROID){  
		var ed = curDate.substr(0, 10); 
		if(id != ""){
			ed = details.started;
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
			value: new Date(res_ed[0],parseInt(res_ed[1]) -1,res_ed[2]),
			callback: function(e) {
			if (e.cancel) { 
				} else {
					changePublishDate(e);
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
			ed = details.ended;
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
			  minDate: new Date(res_ed[0],parseInt(res_ed[1]) -1,res_ed[2]),
			  id: "datePicker",
			  visible: false
		});
		datePicker.showDatePickerDialog({
			value: new Date(res_ed[0],parseInt(res_ed[1]) -1,res_ed[2]),
			 minDate: new Date(res_ed[0],parseInt(res_ed[1]) -1,res_ed[2]),
			callback: function(e) {
			if (e.cancel) { 
				} else {
					changeExpiredDate(e);
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


/*** Event attachment***/
function uploadAttachment(){
	var dialog = Titanium.UI.createOptionDialog({ 
	    title: 'Choose an image source...', 
	    options: ['Camera','Photo Gallery', 'Cancel'], 
	    cancel:2 //index of cancel button
	});
 
	dialog.addEventListener('click', function(e) { 
	    
	    if(e.index == 0) { //if first option was selected
	        //then we are getting image from camera
	        Titanium.Media.showCamera({ 
	            success:function(event) { 
	               var image = event.media;
        		   if(image.width > image.height){
	        			var newWidth = 640;
	        			var ratio =   640 / image.width;
	        			var newHeight = image.height * ratio;
	        		}else{
	        			var newHeight = 640;
	        			var ratio =   640 / image.height;
	        			var newWidth = image.width * ratio;
	        		} 
					image = image.imageAsResized(newWidth, newHeight);  
	                if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
	                   //var nativePath = event.media.nativePath;  
			           uploadAttachmentToServer(image); 
	                }
	            },
	            cancel:function(){
	                //do somehting if user cancels operation
	            },
	            error:function(error) {
	                //error happend, create alert
	                var a = Titanium.UI.createAlertDialog({title:'Camera'});
	                //set message
	                if (error.code == Titanium.Media.NO_CAMERA){
	                    a.setMessage('Device does not have camera');
	                }else{
	                    a.setMessage('Unexpected error: ' + error.code);
	                }
	 
	                // show alert
	                a.show();
	            },
	            allowImageEditing:true,
	            mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	            saveToPhotoGallery:true
	        });
	    } else if(e.index == 1){
	    	 
	    	//obtain an image from the gallery
	        Titanium.Media.openPhotoGallery({
	            success:function(event){
	            	// set image view
	            	var image = event.media; 
	            	if(image.width > image.height){
	        			var newWidth = 640;
	        			var ratio =   640 / image.width;
	        			var newHeight = image.height * ratio;
	        		}else{
	        			var newHeight = 640;
	        			var ratio =   640 / image.height;
	        			var newWidth = image.width * ratio;
	        		} 
					image = image.imageAsResized(newWidth, newHeight);  
		           	uploadAttachmentToServer(image);
		           	loadAttachment(); 
	            },
	            cancel:function() {
	               
	            },
	            
	            mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	        });
	    } else {
	        
	    }
	});
	 
	//show dialog
	dialog.show();
}


function uploadAttachmentToServer(attachment){
	COMMON.showLoading(); 
	var param = {
		id    : id,  
		Filedata : attachment, 
		session : Ti.App.Properties.getString('session')
	};  

	API.callByPostImage({url:"uploadEventAttachmentUrl", params: param}, function(responseText){
		var res = JSON.parse(responseText);  
		console.log(res);
		if(res.status == "success"){   
			eventsAttachmentModel.addAttachment(res.data);
		 	init();
		 	COMMON.hideLoading();
			COMMON.resultPopUp("Create success","Successfully added events attachment!"); 
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
	});
}

function attachedPhoto(image,position){ 
	var iView = $.UI.create('View', {
		backgroundColor: "#D5D5D5",
		height : 50,
		position : position,
		width: 50,
		left:5,
		right: 5,
		bottom:0
	});
	        
	var iImage = Ti.UI.createImageView({
		image : image,
		position :position,
		width: Ti.UI.FILL
	}); 
	iView.add(iImage);
	
	iView.addEventListener('click',function(e){ 
		var page = Alloy.createController("attachmentDetails",{id:id,position:position, type: "events"}).getView(); 
	  	page.open();
	  	page.animate({
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
			opacity: 1,
			duration: 300
		});
		 
	});
	return iView;	            
}

function closeWindow(){ 
	$.win.close();
}

Ti.App.addEventListener('refreshEventsAttachment', init); 