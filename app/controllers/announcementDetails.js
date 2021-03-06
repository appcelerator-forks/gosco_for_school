var args = arguments[0] || {};
var id = args.id || "";
var isCurriculum = args.isCurriculum || "";
var postDetails;
var details; 
COMMON.construct($); 

init();

function init(){
	if(isCurriculum == "1"){
	 	postModel = Alloy.createCollection('curriculumPost'); 
		postElementModel = Alloy.createCollection('curriculumPost_element'); 
	}else{
		postModel = Alloy.createCollection('post'); 
		postElementModel = Alloy.createCollection('post_element'); 	
	}
	
	if(Ti.App.Properties.getString('roles') != "teacher"){
		
	}
	 
	showList(); 
}

function showList(){
	postDetails = postModel.getRecordsById(id);
	details     = postElementModel.getListByPost(id);
	//rightMenu
	var roles = Ti.App.Properties.getString('roles');
	var u_id  = Ti.App.Properties.getString('u_id');
	//console.log(postDetails);
	if(OS_IOS){
		//if((roles == "headmaster") || postDetails.published_role == roles){
		if((roles == "headmaster") || postDetails.published_uid == u_id){
			$.rightMenu.show();
		}else{
			$.rightMenu.hide();
		}
	}
	
	if(OS_ANDROID){
		//
		if((roles == "headmaster") ||  postDetails.published_uid == u_id){
			var activity = $.win.activity;

			activity.onCreateOptionsMenu = function(e){
			  var menu = e.menu;
			  var menuItem = menu.add({
			    title: "Edit",
			    icon:  "/images/edit.png",
			    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
			  });
			  menuItem.addEventListener("click", function(e) {
			   editPost();
			  });
			};
		} 
	}
	
	var title = postDetails.title;
	if(title != "" &&  title != null){
		title = title.replace("&quot;", "'"); 
	}
				
	$.win.title = title;
	var titleLabel = $.UI.create('Label',{
		text: title,
		classes : ["news_title","themeColor"]
	});
	$.myContentView.add(titleLabel);
	var authorDateView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height: Ti.UI.SIZE,
		layout: "vertical",  
	});
	authorDateView.add($.UI.create('Label',{
		text:postDetails.publisher_position + " @ "+ monthFormat(postDetails.publish_date),
		textAlign: "right", 
		right: 10,
		classes : ['font_small','font_light_grey']
	}));
	 
	
	var dateView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height: Ti.UI.SIZE,
		layout: "horizontal",  
	});
 
	dateView.add(authorDateView);
	$.myContentView.add(dateView);		 
	details.forEach(function(entry) {
		var msg = escapeSpecialCharacter(entry.element); 
		if(entry.type == "1"){
			var dynaLabel = $.UI.create('Label',{
				text:msg,
				height: Ti.UI.SIZE,
				classes : ["news_subtitle"]
			});
			$.myContentView.add(dynaLabel);
		}
		
		if(entry.type == "2"){  
			if(OS_IOS){
				$.myContentView.add(COMMON.displayHTMLArticle(msg)); 
			}else{
				$.myContentView.add($.UI.create('Label',{
					html: msg,
					height: Ti.UI.SIZE,
					classes: ['news_paragraph'],
				}));
			} 
		}
		
		if(entry.type == "3"){
			var imageVw = Ti.UI.createView({
				width : Ti.UI.FILL,
				height : Ti.UI.SIZE,
				backgroundColor: "#ffffff", 
			}); 
			var dynaImage = Ti.UI.createImageView({
				image: "", 
				width : Ti.UI.FILL,
				//defaultImage :  "/images/default.png"
			}); 
			
			imageVw.add(dynaImage);
			API.loadRemoteImage(dynaImage,entry.element);  
			$.myContentView.add(imageVw); 
			
			//image event
			 imageVw.addEventListener('click', function(e) { 
				var win = Alloy.createController("imageDetails",{element_id:entry.id, isCurriculum: isCurriculum}).getView(); 
			  	openModal(win);  
		    });
			
			//caption
			var caption = ""; 
			
			if(entry.caption != "" &&  entry.caption != "null"){
				caption = escapeSpecialCharacter(entry.caption);
			}
			var dynaLabel = $.UI.create('Label',{
				text:caption,
				classes : ["image_caption"]
			});
	 
			$.myContentView.add(dynaLabel);
		}
		
		if(entry.type == "4"){
			var yTImage = Ti.UI.createView({
				width : Ti.UI.FILL,
				height: 200,
				backgroundColor: "#000000",  
				top: 10,
				bottom:10
			});
			
			if(OS_IOS){
				var osname = Ti.Platform.osname;    
		    	switch(osname) {
			        case 'ipad':
			           var vidWidth = "50%";
			           break;
			        case 'iphone':
			           var vidWidth = "80%";
			           break;
	            }
	            
				var webView = Ti.UI.createWebView({
				    url: 'http://www.youtube.com/embed/'+entry.element+'?autoplay=1&autohide=1&cc_load_policy=0&color=white&controls=0&fs=0&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0',
				    enableZoomControls: false,
				  //  scalesPageToFit: false,
				    scrollsToTop: false,
				    scalesPageToFit :true,
				    disableBounce: true,
				    showScrollbars: false,
				    width: vidWidth
				});
				yTImage.add(webView);
				$.myContentView.add(yTImage);
			}else{
				var androidYtView = Ti.UI.createView({
					width:Ti.UI.FILL, 
					height:Ti.UI.SIZE,
					top:0,
					bottom:20,
					backgroundColor: "#000000",  
					layout: "vertical"
				});
				var youtubePlayer = require("titutorial.youtubeplayer");
				var playIcon = Ti.UI.createImageView({
					image: "http://img.youtube.com/vi/"+entry.element+"/hqdefault.jpg", 
					width:Ti.UI.SIZE, 
					height:Ti.UI.SIZE
				});
				androidYtView.add(playIcon);
				
				var androidSeperatorView = Ti.UI.createView({ 
					height:30, 
				});
				
				$.myContentView.add(androidYtView); 
				$.myContentView.add(androidSeperatorView); 
				androidYtView.addEventListener( "click", function(){ 
					youtubePlayer.playVideo(entry.element);
				 });
			} 
		}
	});
	COMMON.hideLoading();
} 
 
function editPost(){
	Alloy.Globals.Navigator.open('form',{id: id, isCurriculum : isCurriculum});
} 

function closeWindow(){
	Ti.App.fireEvent('refreshPostList');  
	Ti.App.removeEventListener('refreshPost', refreshPost); 
	Ti.App.removeEventListener('closeFormWindow', closeWindow); 
	$.win.close();
}

function refreshPost(){  
	COMMON.removeAllChildren($.myContentView);
	showList();	
}

Ti.App.addEventListener('closeFormWindow', closeWindow); 
Ti.App.addEventListener('refreshPost', refreshPost); 