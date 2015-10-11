var args = arguments[0] || {};
COMMON.construct($); 
var educationModel = Alloy.createCollection('education'); 
var school; 
var photoLoad;
init();

function init(){ 
	showList(); 
}

function showList(){
	school = educationModel.getSchoolById( Ti.App.Properties.getString('e_id')); 
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
	
	if(Ti.App.Properties.getString('roles') == "teacher"){
		$.saveBtn.height = 0;
	}
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
		session : Ti.App.Properties.getString('session'),
		Filedata : photoLoad 
	}; 
	console.log(param);	 
	API.callByPostImage({url:"updateSchoolUrl", params: param}, function(responseText){
		var res = JSON.parse(responseText); 
	 
		if(res.status == "success"){  
		 	/**load new set of category from API**/
		 	var arr = res.data; 
		    educationModel.saveArray(arr);  
		    Ti.App.fireEvent('refreshData'); 
		    COMMON.resultPopUp("Saved", "Information successfully updated"); 
		} 
	});
}

$.thumbPreview.addEventListener('click', function(){
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
		            	$.thumbPreview.image = image; 
			            photoLoad = image;
			            //mainView.undoPhoto.visible = true;
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
	            	$.thumbPreview.image = image; 
	            	photoLoad = image;
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
});

function hideKeyboard(){
	$.address.blur(); 
}

function closeWindow(){ 
	$.win.close();
} 