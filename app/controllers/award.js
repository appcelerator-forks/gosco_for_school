var args = arguments[0] || {};
COMMON.construct($); 
var postModel = Alloy.createCollection('post'); 
var searchKey = "";
init();

function init(){
	showList();
	syncData();
	
	if(Ti.App.Properties.getString('roles') == "teacher"){
		COMMON.removeAllChildren($.addView);
	}
}

function syncData(){
	var param = { 
		"e_id"	  : Ti.App.Properties.getString('e_id'),
		"session" : Ti.App.Properties.getString('session')
	};
	API.callByPost({url:"getSchoolPost", params: param}, function(responseText){
		COMMON.hideLoading();
		var res = JSON.parse(responseText); 
		if(res.status == "success"){ 
			var postData = res.data; 
			 if(postData != ""){ 
			 	 var post = res.data.post;   
				 postModel.addPost(post); 
				 var post_element_model = Alloy.createCollection('post_element');  
				 post_element_model.addElement(post);  
				 showList();  
			 } 
			
		}else{
			$.win.close();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
	});
	
}

function showList(){
	var latestPost = postModel.getPostByEducation( Ti.App.Properties.getString('e_id'),2,searchKey);  
	 
 	COMMON.removeAllChildren($.announcementSv);
	if(latestPost.length > 0){ 
		var count = 1;
		latestPost.forEach(function(entry) { 
			var view0 = $.UI.create('View',{
				classes :['hsize' ],
				source :entry.id,
				selectedBackgroundColor : "#ffffff", 
			});
			
			var view1 = $.UI.create('View',{
				classes :['hsize', 'vert'],
				source :entry.id,
				selectedBackgroundColor : "#ffffff", 
			});
			
			var label1 = $.UI.create('Label',{
				classes :['h5','hsize' ,'themeColor', 'padding-left' ], 
				top:12,
				width: "80%",
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
			$.announcementSv.add(view0);
			
			if(latestPost.length != count){
				var viewLine = $.UI.create('View',{
					classes :['gray-line']
				}); 
				$.announcementSv.add(viewLine);
			} 
			count++; 
		});  
	} 
	COMMON.hideLoading();
}


function separateHozLine(){
	return seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:1, 
		top:5,
		width:Ti.UI.FILL
	});
} 
 
function goDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);    
	Alloy.Globals.Navigator.open('announcementDetails',{id: res.source, isCurriculum :""});
}


function closeWindow(){
	$.win.close();
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

$.refresh.addEventListener('click', function(){    
	COMMON.showLoading();
	syncData();
}); 

$.add.addEventListener('click', function(){
	Alloy.Globals.Navigator.open('form',{id: "", isCurriculum : "", formType: "2"});
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
