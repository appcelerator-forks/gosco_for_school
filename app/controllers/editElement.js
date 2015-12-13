var args = arguments[0] || {};
var id = args.id || "";
var p_id=args.p_id || "";
var isCurriculum = args.isCurriculum || "";
var eleType =  args.elementType || ""; 
 
var details;
var postElementModel;
var element1;
var element2;
var element3a;
var attachment;
COMMON.construct($); 

init();

function init(){
	if(isCurriculum == "1"){ 
	 	postElementModel = Alloy.createCollection('curriculumPost_element');  
	}else{ 
		postElementModel = Alloy.createCollection('post_element');  
	}
	 
	if(eleType != ""){ 
		$.saveBtn.title = "Create";
		newList();
	}else{ 
		showList();
	}
	
	if(OS_IOS){
		$.elementView.top = 60;
	}
}

function newList(){ 
	var view0 = $.UI.create('View',{
		classes: ['vert', 'wfill', 'hsize','padding']
	});
		
	var elementType = Alloy.Globals.ElementType[parseInt(eleType) -1];
	 
	var lbl1 = $.UI.create('Label',{
		text: "Type : " + elementType,
		classes: ['hsize','vert','padding-top','padding', 'themeColor'],
	});
	
	if(eleType == 1){
		element2 = $.UI.create('TextField',{
			value: "",
			classes: ['hsize','wfill','padding'],
		}); 
		view0.add(lbl1);
		view0.add(element2);
	}
	
	if(eleType == 2){
		element2 = $.UI.create('TextArea',{
			value: "",
			classes: [ 'wfill','padding'],
			borderColor : "#f5f5f5",
			height:200
		});
		 
		view0.add(lbl1);
		view0.add(element2);
	}
	
	if( eleType == 3){
		element2 = $.UI.create('ImageView',{
			image: "/images/icon_take_photo.png",
			width:320,
			height:320,
			classes: [ 'padding' ],
		});
	 	
	 	element3a = $.UI.create('TextField',{
			hintText: "Photo Caption",
			classes: ['hsize','wfill','padding'],
		}); 
		view0.add(lbl1);
		view0.add(element2);
		view0.add(element3a);
		element2.addEventListener('click',takePhoto); 
	}
			 
	$.editForm.add(view0);
}

function takePhoto(){
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
		            	element2.image = image;
		            	attachment = image;
			           // blobContainer = image; 
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
					 
	            	element2.image = image;
	            	attachment = image;
		           // blobContainer = image; 
		            	 
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


function showList(){
	details = postElementModel.getRecordsById(id);
	var view0 = $.UI.create('View',{
		classes: ['vert', 'wfill', 'hsize','padding'],
		source :details.id
	});
		
	var elementType = Alloy.Globals.ElementType[parseInt(details.type) - 1];
	var msg = escapeSpecialCharacter(details.element); 
	var lbl1 = $.UI.create('Label',{
		text: "Type : " + elementType,
		classes: ['hsize','vert','padding', 'themeColor'],
	});
	
	if(details.type == 1){
		element2 = $.UI.create('TextField',{
			value: msg,
			classes: ['hsize','wfill','padding'],
		}); 
		view0.add(lbl1);
		view0.add(element2);
	}
	
	if(details.type == 2){
		element2 = $.UI.create('TextArea',{
			value: msg,
			classes: ['hsize','wfill'],
			borderColor : "#f5f5f5"
		});
		 
		view0.add(lbl1);
		view0.add(element2);
	}
	
	if(details.type == 3){
		element2 = $.UI.create('ImageView',{
			image: details.element,
			classes: ['wfill' ],
		});
	 	
	 	element3a = $.UI.create('TextField',{
			value: details.caption,
			hintText: "Photo Caption",
			classes: ['hsize','wfill','padding-bottom'],
		}); 
		view0.add(lbl1);
		view0.add(element2);
		view0.add(element3a); 
	} 	 
	$.editForm.add(view0);
}

function save(){
	var id = details || "";
	COMMON.showLoading();
	if(id == ""){ 
		if(eleType == 3){//image
			if(OS_ANDROID){
				attachment = attachment;
			}else{
				attachment = element2.toImage();
			}      
			var param = {
				a_id    : p_id, 
				type    : eleType,
				Filedata : attachment,//element2.toImage(),
				caption : element3a.value,
				isCurriculum: isCurriculum,
				session : Ti.App.Properties.getString('session')
			}; 
			API.callByPostImage({url:"addElementUrl", params: param}, function(responseText){
				var res = JSON.parse(responseText);  
				if(res.status == "success"){  
					if(isCurriculum == "1"){ 
					 	postElementModel = Alloy.createCollection('curriculumPost_element');  
					}else{ 
						postElementModel = Alloy.createCollection('post_element');  
					}
					postElementModel.addElement(res.data);  
					COMMON.resultPopUp("Saved", "Photo is uploaded"); 
					closeWindow();
					$.saveBtn.visible = false;
				}else{
					$.win.close();
					COMMON.hideLoading();
					Alloy.Globals.Navigator.open("login");
					COMMON.resultPopUp("Session Expired", res.data); 
				}
				COMMON.hideLoading();
			});
		}else{
			var param = {
				a_id    : p_id, 
				type    : eleType,
				element : element2.value,
				isCurriculum: isCurriculum,
				session : Ti.App.Properties.getString('session')
			};
			 
			API.callByPost({url:"addElementUrl", params: param}, function(responseText){
				var res = JSON.parse(responseText);  
				if(res.status == "success"){  
					postElementModel.addElement(res.data);
					/**if(eleType == "1"){
						COMMON.resultPopUp("Saved", "Sub title are added"); 
					} else if(eleType == "2"){
						COMMON.resultPopUp("Saved", "Paragraph is added"); 
					} else{
						COMMON.resultPopUp("Saved", "Photo is added"); 
					} **/
					closeWindow();
					$.saveBtn.visible = false;
				}else{
					$.win.close();
					COMMON.hideLoading();
					Alloy.Globals.Navigator.open("login");
					COMMON.resultPopUp("Session Expired", res.data); 
				}
				COMMON.hideLoading();
			});
		}
	 
		
		
	}else{  
		if(details.type == 3){//image
			var param = {
				id    : details.id, 
				type    : details.type, 
				element : details.element,
				caption : element3a.value,
				isCurriculum: isCurriculum,
				session : Ti.App.Properties.getString('session')
			}; 
		 
		}else{
			var param = {
				id  	: details.id,
				type    : details.type,
				element : element2.value,
				caption : "",
				isCurriculum: isCurriculum,
				session : Ti.App.Properties.getString('session')
			}; 
		} 
 
		API.callByPost({url:"updateElementUrl", params: param}, function(responseText){
			var res = JSON.parse(responseText);  
			if(res.status == "success"){   
			
				postElementModel.updateElement(res.data.id,res.data.element,res.data.caption);  
				//COMMON.resultPopUp("Saved", "Records successfully updated"); 
				closeWindow();
			}else{
				$.win.close();
				COMMON.hideLoading();
				Alloy.Globals.Navigator.open("login");
				COMMON.resultPopUp("Session Expired", res.data); 
			}
		});
		COMMON.hideLoading();
	}
	 
}


function closeWindow(){
	Ti.App.fireEvent('refreshElement');  
	$.win.close();
}