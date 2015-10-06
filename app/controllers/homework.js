var args = arguments[0] || {};
COMMON.construct($); 
var homeworkModel = Alloy.createCollection('homework'); 
var homeworkAttachmentModel = Alloy.createCollection('homeworkAttachment'); 

var searchKey = "";
init();

function init(){
	showList();
	syncData();
}

function syncData(){
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById(3, Ti.App.Properties.getString('u_id'));
	var last_updated ="";
	 
	if(isUpdate != "" ){
		last_updated = isUpdate.updated;
	} 
	
	var param = { 
		"last_updated"	  : last_updated,
		"session" : Ti.App.Properties.getString('session')
	};
	COMMON.showLoading();
	API.callByPost({url:"getHomeworkList", params: param}, function(responseText){
		
		var res = JSON.parse(responseText); 
		
		if(res.status == "success"){  
			var arr = res.data;  
			homeworkModel.saveArray(arr);  
			homeworkAttachmentModel.saveArray(arr);
			checker.updateModule(3,"homeworkList", COMMON.now(), Ti.App.Properties.getString('u_id'));
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
  
	COMMON.hideLoading(); 
	details = homeworkModel.getHomeworkByTeacher(Ti.App.Properties.getString('u_id'),searchKey);
 	COMMON.removeAllChildren($.list);  
	if(details.length > 0){ 
		var count =1;
		var currentDate;
		details.forEach(function(entry) {
			var cre = entry.created.substring(0,10); 
			if(cre != currentDate){
				var view11 = $.UI.create('View',{
					classes :['hsize','themeBg','padding','box' ],  
				});
				var label0 = $.UI.create('Label',{
					classes :['h5','hsize' ,'whiteColor', 'padding-top', 'padding-bottom', 'wfill','center' ],   
					text: timeFormat(cre)
				});
				view11.add(label0);
				currentDate = cre;
				$.list.add(view11);
			} 
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
				width: "80%",
				source :entry.id,
				text: entry.subject
			});
			 
			var label2 = $.UI.create('Label',{
				classes :['h6', 'hsize' ,'font_light_grey', 'padding-left','padding-bottom' ], 
				top:5,
				width: "80%",
				source :entry.id,
				text: entry.remark  
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
	Alloy.Globals.Navigator.open('homeworkForm',{id: res.source});
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
	});
}

function closeWindow(){
	Ti.App.removeEventListener('refreshShowList', syncData); 
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
	Alloy.Globals.Navigator.open('homeworkForm');
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

Ti.App.addEventListener('refreshShowList', syncData); 