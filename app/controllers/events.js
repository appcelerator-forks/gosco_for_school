var args = arguments[0] || {};
COMMON.construct($); 
var eventsModel = Alloy.createCollection('events'); 
var eventsAttachmentModel = Alloy.createCollection('eventsAttachment'); 
var searchKey = "";
init();

function init(){ 
	COMMON.showLoading();
	setTimeout(function(){
		syncData();
	},2000); 
	
	if(Ti.App.Properties.getString('roles') == "teacher"){
		COMMON.removeAllChildren($.addView);
	}
}

function syncData(){
	var param = { 
		"e_id"	  : Ti.App.Properties.getString('e_id'),
		"session" : Ti.App.Properties.getString('session')
	};
	COMMON.showLoading();
	API.callByPost({url:"getEventsList", params: param}, function(responseText){ 
		var res = JSON.parse(responseText); 
		if(res.status == "success"){ 
			var eventsModel = Alloy.createCollection('events'); 
			var arr = res.data;  
			eventsModel.saveArray(arr); 
			eventsAttachmentModel.saveArray(arr);
			showList();
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
	}, function(){
		// on error
		showList();
	});
}

function showList(){  
 	var curTable = $.UI.create('TableView',{
		classes : ['wfill','hsize' , 'padding' ], 
		backgroundColor: "#ffffff",
		bottom:5,
		top:0 
	}); 
	COMMON.hideLoading();
	var data = []; 		
	details = eventsModel.getEventByEducation(Ti.App.Properties.getString('e_id'), searchKey);
 	COMMON.removeAllChildren($.list);
	if(details.length > 0){ 
		var count = 0;
		details.forEach(function(entry) { 
			var statusColor = "#8A6500";
			if(entry.status == "1"){ //publish
				statusColor = "#2C8A00";
			} 
			if(entry.ended < currentDateTime() ){  
				statusColor = "#CE1D1C";
			}
			
			var horzView = $.UI.create('View',{
				classes: ['horz','wfill'], 
				source: entry.id,  
				height: 70 
			});
			
			var statustView = $.UI.create('View',{
				classes: ['hfill'],
				source: entry.id,
				width: 10,
				backgroundColor: statusColor
			});
			horzView.add(statustView);
			
    		var view0 = $.UI.create('View',{
				classes :['hsize' ],
				source :entry.id,
				width: "auto",
				backgroundColor : "#ffffff", 
			}); 
			var view1 = $.UI.create('View',{
				classes :['hsize', 'vert'],
				source :entry.id,
				backgroundColor : "#ffffff", 
			});
			
			var title = entry.title;
			if(title.trim() != "" &&  title.trim() != null){
				title = title.replace("&quot;", "'"); 
			}
			
			var label1 = $.UI.create('Label',{
				classes :['h6','hsize' ,'themeColor', 'padding-left','bold' ],  
				width: "90%",
				source :entry.id,
				text: textLimit(title,80)
			});
			 
			var label2 = $.UI.create('Label',{
				classes :['h6', 'hsize','wfill','font_light_grey', 'padding-left' ],  
				source :entry.id,
				text:  "From "+ timeFormat(entry.started) + " - "+ timeFormat(entry.ended)
			});
			
			var label3 = $.UI.create('Label',{
				classes :['h6', 'hsize','wfill','font_light_grey', 'padding-left' ],  
				source :entry.id, 
				text:  entry.published_by
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
			view1.add(label3);
			view0.add(view1);
			if(Ti.App.Properties.getString('roles') != "teacher"){
				view0.add(imgView1); 
				view0.addEventListener('click', goDetails);
			}
			horzView.add(view0);
			
			$.list.add(horzView);
			
			if(details.length != count){
				var viewLine = $.UI.create('View',{
					classes :['gray-line']
				}); 
				$.list.add(viewLine);
			} 
			count++; 
		});
	}else{
	 
	}
	COMMON.hideLoading();
}

function goDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);  
	Alloy.Globals.Navigator.open('eventsForm',{id: res.source}); 
}

function separateHozLine(){
	return seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:1, 
		top:5,
		width:Ti.UI.FILL
	});
}  
function closeWindow(){
	Ti.App.removeEventListener('refreshPost', refreshPost); 
	$.win.close();
}


/***SEARCH FUNCTION***/
function searchResult(){
	$.searchItem.blur(); 
	COMMON.showLoading();
	searchKey = $.searchItem.getValue(); 
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
	Alloy.Globals.Navigator.open('eventsForm',{id: ""}); 
});

$.refresh.addEventListener('click', function(){    
	syncData();
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

function refreshPost(){  
	COMMON.removeAllChildren($.list);
	syncData();	
}

Ti.App.addEventListener('refreshPost', refreshPost); 