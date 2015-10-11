var args = arguments[0] || {};
var id = args.id || "";
COMMON.construct($); 
var curriculumModel = Alloy.createCollection('curriculum'); 
var curriculumPostModel = Alloy.createCollection('curriculumPost'); 
var curriculumPostElementModel = Alloy.createCollection('curriculumPost_element'); 
var photoLoad;
var searchKey ="";
init();

function init(){
	var curriculum = curriculumModel.getCurriculumById(id);
	console.log(curriculum);
	$.thumbPreview.image = curriculum.img_path;	
	$.description.text   = curriculum.description;
	$.win.title = curriculum.curriculum; 
	showList();
	syncData();
}

function showList(){
	var list = curriculumPostModel.getLatestPostByCurriculum(id,searchKey); 
	COMMON.hideLoading(); 
 	COMMON.removeAllChildren($.list);
	if(list.length > 0){ 
		var count = 0;
		list.forEach(function(entry) {
			var view0 = $.UI.create('View',{
				classes :['hsize','wfill' ],
				source :entry.id
			});
			
			var view1 = $.UI.create('View',{
				classes :['hsize', 'vert', 'wfill'],
				source :entry.id 
			});
			
			var label1 = $.UI.create('Label',{
				classes :['h5','hsize', 'wfill','themeColor', 'padding-left' ], 
				top:12,
				source :entry.id,
				text: entry.title
			});
			 
			var label2 = $.UI.create('Label',{
				classes :['h6', 'hsize','wfill','font_light_grey', 'padding-left','padding-bottom' ], 
				top:5,
				source :entry.id,
				text: entry.published_by + " at "+ timeFormat(entry.publish_date)
			});
			
			var imgView1 = $.UI.create('ImageView',{
				image : "/images/btn-forward.png",
				source :entry.id,
				width : 20,
				height : 20,
				right: 10
			});
		 	
			view1.add(label1);
			view1.add(label2);
			view0.add(view1);
			view0.add(imgView1);
			view0.addEventListener('click', goDetails);
			$.list.add(view0);
			
			if(list.length != count){
				var viewLine = $.UI.create('View',{
					classes :['gray-line']
				}); 
				$.list.add(label1);
			} 
			count++;
		});
	}else{
		var view0 = $.UI.create('View',{
			classes :['hsize' ], 
			selectedBackgroundColor : "#ffffff", 
		});
		var label1 = $.UI.create('Label',{
			classes :['h6','hsize', 'wfill','themeColor', 'padding' ],  
			text: "No record available"
		});
		view0.add(label1);	
		$.list.add(view0);
	}
}

function goDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);     
	Alloy.Globals.Navigator.open('announcementDetails',{id: res.source, isCurriculum :1});
}

function syncData(){
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById(2, id);
	var last_updated ="";
	 
	if(isUpdate != "" ){
		last_updated = isUpdate.updated;
	} 
	var param = { 
		"c_id"	  : id,
		"session" : Ti.App.Properties.getString('session'),
		"last_updated" : last_updated
	};
	COMMON.showLoading();
	API.callByPost({url:"getCurriculumPost", params: param}, function(responseText){
		
		var res = JSON.parse(responseText);  
		if(res.status == "success"){  
			var postData = res.data; 
			if(postData != ""){ 
				var post = res.data.post;   
				curriculumPostModel.addPost(post);  
				curriculumPostElementModel.addElement(post);   
				showList();  
			}  
			checker.updateModule(2,"curriculumPost", COMMON.now(), id);
			COMMON.hideLoading();
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
	});
}

function closeWindow(){
	$.win.close();
}

$.refresh.addEventListener('click', function(){    
	syncData();
}); 

function uploadAttachmentToServer(attachment){
	COMMON.showLoading(); 
	var param = {
		id    : id,  
		Filedata : attachment, 
		session : Ti.App.Properties.getString('session')
	};  

	API.callByPostImage({url:"uploadCurriculumLogoUrl", params: param}, function(responseText){
		var res = JSON.parse(responseText);  
		if(res.status == "success"){   
			curriculumModel.updateAttachment(res.data);
		 	init();
		 	COMMON.hideLoading();
			COMMON.resultPopUp("Update success","Successfully added curriculum attachment!"); 
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
	});
}

/***SEARCH FUNCTION***/
function searchResult(){
	$.searchItem.blur(); 
	COMMON.showLoading();
	searchKey = $.searchItem.getValue(); 
	console.log("searchKey : "+searchKey);
	showList();
}

$.searchItem.addEventListener("return", searchResult);

$.searchItem.addEventListener('focus', function f(e){
	$.searchItem.removeEventListener('focus', f);
});

$.searchItem.addEventListener('cancel', function(e){ 
	$.searchItem.blur();
	searchKey = "";
	showList();
});

$.searchItem.addEventListener('blur', function(e){
	 
});

$.add.addEventListener('click', function(){
	Alloy.Globals.Navigator.open('form',{id: "", isCurriculum : id, formType: "1"});
});

$.search.addEventListener('click', function(){    
	var isVis=  $.searchItem.getVisible(); 
	if(isVis === true){ 
		$.searchItem.visible = false;
		$.searchItem.height = 0;
		
	}else{ 
		$.searchItem.visible = true;
		$.searchItem.height = 50;
	}
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
			            uploadAttachmentToServer(image);
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
	            	uploadAttachmentToServer(image);
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
 