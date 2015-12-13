var args = arguments[0] || {};
COMMON.construct($); 
var userModel = Alloy.createCollection('user'); 
var searchKey = "";
var details;
init();

function init(){ 
	syncData();
}

function showList(){
 
	COMMON.hideLoading();
	var data = []; 		
	details = userModel.getUserByEducation(Ti.App.Properties.getString('e_id'), searchKey); 
 	COMMON.removeAllChildren($.list);
	if(details.length > 0){ 
		var count = 0;
		details.forEach(function(entry) { 
			var statusColor = "#8A6500";
			if(entry.status == "1"){ //publish
				statusColor = "#2C8A00";
			} 
			if(entry.ended == "3" ){  
				statusColor = "#CE1D1C";
			}
			
			var horzView = $.UI.create('View',{
				classes: ['horz','wfill'], 
				source: entry.id,  
				height: 50 
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
			
			var label1 = $.UI.create('Label',{
				classes :['h6','hsize' ,'themeColor', 'padding-left','bold' ],  
				width: "90%",
				source :entry.id,
				text: entry.fullname
			});
			 
			var label2 = $.UI.create('Label',{
				classes :['h6', 'hsize','wfill','font_light_grey', 'padding-left' ],  
				source :entry.id,
				text:  entry.position
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
			view0.add(imgView1);
			view0.addEventListener('click', goDetails);
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
}

function syncData(){
	var param = { 
		"e_id"	  : Ti.App.Properties.getString('e_id'),
		"session" : Ti.App.Properties.getString('session')
	};
	API.callByPost({url:"getStaffListUrl", params: param}, function(responseText){
		COMMON.hideLoading();
		var res = JSON.parse(responseText); 
		if(res.status == "success"){ 
			var record = res.data; 
			 if(record.length > 0){  
			 	userModel.resetStaff();
				userModel.saveArray(record);   
				
			 } 
			showList();  
		}else{
			$.win.close();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
	}, function(){
		showList();  
	});
}
 
function goDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);  
	Alloy.Globals.Navigator.open('staffForm',{id: res.source}); 
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
	syncData();
}); 

$.add.addEventListener('click', function(){
	Alloy.Globals.Navigator.open('staffForm',{id: ""});
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


function closeWindow(){
	Ti.App.removeEventListener('refreshStaffList', showList); 
	$.win.close();
}

Ti.App.addEventListener('refreshStaffList', showList); 
