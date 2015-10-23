var args = arguments[0] || {};
COMMON.construct($); 
var curriculumModel = Alloy.createCollection('curriculum'); 
var searchKey = "";
init();

function init(){
	showList();
	syncData();
}

function syncData(){
	var param = { 
		"e_id"	  : Ti.App.Properties.getString('e_id'),
		"session" : Ti.App.Properties.getString('session')
	};
	COMMON.showLoading();
	API.callByPost({url:"getCurriculumList", params: param}, function(responseText){
		
		var res = JSON.parse(responseText); 
		if(res.status == "success"){ 
			var curriculumModel = Alloy.createCollection('curriculum'); 
			var arr = res.data;  
			curriculumModel.saveArray(arr); 
			if(arr.length > 0){
				showList();  
			}
			
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
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
	details = curriculumModel.getCurriculumByEducation(Ti.App.Properties.getString('e_id'),searchKey);
 	
	if(details.length > 0){ 
		details.forEach(function(entry) {
    		var tblRowView = Ti.UI.createTableViewRow({
				hasChild: true,
				height: 50, 
				id: entry.id, 
			}); 
			
			var titleView = $.UI.create('View', { 
				classes: ['horz', 'wfill', 'hsize'],
				height: Ti.UI.SIZE, 
				id: entry.id, 
			});
			
			var titleLbl = $.UI.create('Label', { 
				classes: ['horz',  'hsize'], 
				text: entry.curriculum,
				left:10,
				color: "#000000",
				id: entry.id
			});
			titleView.add(titleLbl);
			tblRowView.add(titleView);
			tblRowView.addEventListener('click',readCurriculumDetails);  
			  
			data.push(tblRowView);
		});
	
		curTable.setData(data);
		COMMON.removeAllChildren($.list);
		$.list.add(curTable);
	}else{
	 
	}
}

function readCurriculumDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);     
	Alloy.Globals.Navigator.open('curriculumDetails',{id: res.id});
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

function addClickEvent(vw){
	vw.addEventListener('click', function(e){ 
		var elbl = JSON.stringify(e.source); 
		var res = JSON.parse(elbl); 
		 
		var win = Alloy.createController("postDetails", {p_id: res.source}).getView(); 
		//COMMON.openWindow(win); 
		Alloy.Globals.tabgroup.activeTab.open(win);
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

$.add.addEventListener('click', function(){    
	Alloy.Globals.Navigator.open('curriculumForm',{id: ""});
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