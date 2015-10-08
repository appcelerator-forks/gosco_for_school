var args = arguments[0] || {};
COMMON.construct($); 
var h_id = args.id || "";
var homeworkModel = Alloy.createCollection('homework'); 
var homeworkAttachmentModel = Alloy.createCollection('homeworkAttachment'); 
var subjectModel = Alloy.createCollection('subjects');
var educationClassModel = Alloy.createCollection('education_class');
var subject;
var classId;
var details;
init();

function init(){
	subject = subjectModel.getSubjectByUser(Ti.App.Properties.getString('u_id'), "");
	
	if(h_id != ""){
		details = homeworkModel.getHomeworkById(h_id);
		
		classId =details.ec_id;
		var eduClass= educationClassModel.getEducationClassById(details.ec_id);
		$.class_value.text = eduClass.className;
		$.class_value.color= "#000000";
		$.subject.value = details.subject;
		$.remark.value  = details.remark;
		$.expired_date.text = convertFromDBDateFormat(details.deadline);
		$.expired_date.color= "#000000";
		$.saveBtn.title= "Update Homework"; 
		loadAttachment();
	}else{
		$.attView.visible = false;
	}
}

function hideKeyboard(){ 
	$.remark.blur();
}

$.tvrClass.addEventListener('click', function(){
	var classList =educationClassModel.getEducationClassList(new Date().getFullYear() , Ti.App.Properties.getString('e_id'));
	 
	var classArr = []; 
	var classIdArr = [];
	classList.forEach(function(entry) {
		if(entry.state != ""){
			classArr.push(entry.className);
			classIdArr.push(entry.id);
		} 
	});
	classArr.push("Cancel"); 
	var cancelBtn = classArr.length -1;
	var dialog = Ti.UI.createOptionDialog({
		  cancel: classArr.length -1,
		  options: classArr, 
		  title: 'Choose Class'
	});
		
	dialog.show();	 
	dialog.addEventListener("click", function(e){   
		if(cancelBtn != e.index){ 
			$.class_value.text = classArr[e.index];
			$.class_value.color= "#000000";
			classId  = classIdArr[e.index]; 
		}
	});
});

$.addSubject.addEventListener('click', function(){
	var subject = $.subject.value;
	if(subject.trim() != ""){ 
	 	var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: ['Cancel','Confirm'],
		    message: 'Are you sure want to add '+subject+'?',
		    title: 'Add subject'
		});
		dialog.addEventListener('click', function(e){ 
			if (e.index === e.source.cancel){
		      //Do nothing
		    }
		    if (e.index === 1){
		    	var param = {
					id : "",
					u_id : Ti.App.Properties.getString('u_id'),
					subject : subject.trim()
				};
				subjectModel.saveArray(param);
				
				COMMON.resultPopUp("Add Subject", "Added "+subject+" to my favourite list");
			} 
		});
		dialog.show();  
	} 
});

$.getSubject.addEventListener('click', function(){ 
	subject = subjectModel.getSubjectByUser(Ti.App.Properties.getString('u_id'), "");
	var subjectArr = []; 
	subject.forEach(function(entry) {
		if(entry.state != ""){
			subjectArr.push(entry.subject);
		} 
	});
	subjectArr.push("Cancel"); 
	var cancelBtn = subjectArr.length -1;
	var dialog = Ti.UI.createOptionDialog({
		  cancel: subjectArr.length -1,
		  options: subjectArr,
		  selectedIndex: 0,
		  title: 'Choose Subject'
	});
		
	dialog.show();	 
	dialog.addEventListener("click", function(e){   
		if(cancelBtn != e.index){ 
			$.subject.value = subjectArr[e.index];
			$.subject.color= "#000000";
		}
	});
});

function save(){
	classId = classId || ""; 
	var subject = $.subject.value;
	var remark = $.remark.value;
	var expired_date = $.expired_date.text;
	 
	if(subject.trim() == "" ){
		COMMON.resultPopUp("Add Fail","Please fill in subject");
		return false;
	}
	
	if(classId  == "" ){
		COMMON.resultPopUp("Add Fail","Please select a class");
		return false;
	}
	
	if(expired_date != ""){
		expired_date = convertToDBDateFormat(expired_date);
	}
	
	var param = { 
		"id" : h_id,
		"subject" : subject,
		"remark" : remark,
		"ec_id" : classId,
		"deadline" : expired_date,
		"status"  : 1,
		"session" : Ti.App.Properties.getString('session')
	};
	 
	API.callByPost({url:"addHomeworkUrl", params: param}, function(responseText){
		var res = JSON.parse(responseText); 
		
		if(res.status == "success"){   
			Ti.App.fireEvent('refreshShowList');  
			COMMON.resultPopUp("Create success","Successfully create homework!");
			closeWindow();  
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
	});
}

function changeExpiredDate(e){ 
	$.expired_date.text = dateConvert(e.value); 
	$.expired_date.color= "#000000";
}

function hideDatePicker(){
	$.dateExpiredPicker.visible = false; 
	$.dateToolbar.visible = false;
	$.selectorView.height = 0;
}

function showExpiredPicker(){  
	
	if(OS_ANDROID){ 
		var curDate = currentDateTime();
		var ed =  curDate.substr(0, 10);
		if(h_id != ""){
			ed = details.deadline;
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
					changeExpiredDate(e);
				}
			}
		});
	}else{  
		$.dateExpiredPicker.visible = true;
		$.dateToolbar.visible = true;
		$.selectorView.height = Ti.UI.SIZE;
	} 
	
	hideKeyboard();
}
 
function closeWindow(){  
	Ti.App.removeEventListener('refreshAttachment', init); 
	$.win.close();
}

/*** Homework attachment***/
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

function loadAttachment(){
	var attList = homeworkAttachmentModel.getRecordByHomework(h_id); 
	var counter = 0;
	 
	COMMON.removeAllChildren($.attachment);
	if(attList.length > 0){ 
	 	attList.forEach(function(att){  
	 		$.attachment.add(attachedPhoto(att.img_thumb, counter));
	 		counter++;  
	 	}); 
	 }
}

function uploadAttachmentToServer(attachment){
	COMMON.showLoading(); 
	var param = {
		h_id    : h_id,  
		Filedata : attachment, 
		session : Ti.App.Properties.getString('session')
	};  

	API.callByPostImage({url:"uploadHomeworkAttachmentUrl", params: param}, function(responseText){
		var res = JSON.parse(responseText);  
		if(res.status == "success"){   
			homeworkAttachmentModel.addAttachment(res.data);
		 	init();
		 	COMMON.hideLoading();
			COMMON.resultPopUp("Create success","Successfully added homework attachment!"); 
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
		var page = Alloy.createController("attachmentDetails",{h_id:h_id,position:position}).getView(); 
	  	page.open();
	  	page.animate({
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
			opacity: 1,
			duration: 300
		});
		 
	});
	return iView;	            
}

Ti.App.addEventListener('refreshAttachment', init); 