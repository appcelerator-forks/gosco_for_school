var args = arguments[0] || {};
COMMON.construct($); 
var eventsModel = Alloy.createCollection('events'); 
var searchKey = "";
init();

function init(){
	//showList();
	syncData();
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
			showList();
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.createAlert("Session Expired", res.data); 
		}
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
				top:10,
				width: "80%",
				source :entry.id,
				text: entry.title
			});
			 
			var label2 = $.UI.create('Label',{
				classes :['h6', 'hsize','wfill','font_light_grey', 'padding-left','padding-bottom' ],  
				source :entry.id,
				text:  "From "+ timeFormat(entry.started) + " - "+ timeFormat(entry.ended)
			});
			
			var label3 = $.UI.create('Label',{
				classes :['h6', 'hsize','wfill','font_light_grey', 'padding-left','padding-bottom' ],  
				source :entry.id,
				top:0,
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
			view0.add(imgView1);
			view0.addEventListener('click', goDetails);
			$.list.add(view0);
			
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
}

function goDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);     
	console.log(res.source);
	//Alloy.Globals.Navigator.open('curriculumDetails',{id: res.id});
	//var win = Alloy.createController("school/curriculum_post_list", {c_id: res.c_id}).getView(); 
 	//Alloy.Globals.schooltabgroup.activeTab.open(win);
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