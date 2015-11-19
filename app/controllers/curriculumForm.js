var args = arguments[0] || {};
var id = args.id || "";
var curriculumModel = Alloy.createCollection('curriculum'); 

var details;
var selected = 0; 
var attachment;
COMMON.construct($);  
init();

function init(){
	if(id != ""){ 
		details = curriculumModel.getCurriculumById(id);
		if(details.img_path != ""){
			$.thumbPreview.image = details.img_path;
		}
		
		$.name.value = details.curriculum;
		$.description.value = details.description;
		if(details.status == 1){ 
			$.statusSwitch.value = true;
		}
		selected = parseInt(details.type) -1;
		$.type.text  = Alloy.Globals.CurriculumType[selected];
		$.type.color= "#000000";
	}else{
		$.thumbContainer.height = 0;
		$.thumbContainer.hide();
	}
	
}

function hideKeyboard(){
	$.name.blur();
	$.description.blur();
}  

function save(){
	var title = $.name.value;
	var description = $.description.value;
	var status = $.statusSwitch.value; 
	var description = $.description.value;
	if(status == false){
		status = 2;
	}else{
		status = 1;
	}
	
	var param = { 
		"id" : id,
		"e_id" : Ti.App.Properties.getString('e_id'),
		"curriculum" : title,
		"description" : description,
		"type" : parseInt(selected) + 1, 
		"status"  : status,
		"Filedata" : attachment,
		"session" : Ti.App.Properties.getString('session')
	}; 
			
	API.callByPostImage({url:"addUpdateCurriculumUrl", params: param}, function(responseText){
		var res = JSON.parse(responseText);  
		if(res.status == "success"){   
			var arr = res.data;   
			curriculumModel.saveArray(arr); 
			 
			Ti.App.fireEvent('refreshCurriculumPost');  
			if(id == ""){
				COMMON.resultPopUp("Create success","Successfully created curriculum!");
			}else{
				COMMON.resultPopUp("Update success","Successfully update this curriculum!");
			}
			 
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
	});
}

$.tvrType.addEventListener('click', function(){
	var curriculumType = [];
	var curriculumType = Alloy.Globals.CurriculumType;  
	var cancelBtn = curriculumType.length -1;
	var dialog = Ti.UI.createOptionDialog({
		  cancel: curriculumType.length -1,
		  options: curriculumType,
		  selectedIndex: selected,
		  title: 'Choose Curriculum Type'
	});
		
	dialog.show();	 
	dialog.addEventListener("click", function(e){   
		if(cancelBtn != e.index){ 
			dialog.selectedIndex = e.index;
			selected = e.index;
			$.type.value = curriculumType[e.index];
			$.type.color= "#000000";
		}
	});
 
});

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
			            attachment = image;
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
	            	attachment = image;
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

function closeWindow(){  
	$.win.close();
}