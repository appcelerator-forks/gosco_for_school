var args = arguments[0] || {}; 
var isCurriculum = args.isCurriculum || "";
var id = args.id || "";
var details;
COMMON.construct($); 

init();

function init(){
	if(isCurriculum != ""){
	 	postElementModel = Alloy.createCollection('curriculumPost_element');  
	}else{
		postElementModel = Alloy.createCollection('post_element');  
	}
	 
	showList();
}

function showList(){
	details = postElementModel.getListByPost(id);  
	 
	if(details.length > 0){
		 
		var count =1;
		details.forEach(function(entry) { 
			var view0 = $.UI.create('View',{
				classes: ['vert', 'wfill', 'hsize','padding', 'box'],
				source :entry.id
			});
			var elementType = Alloy.Globals.ElementType[parseInt(entry.type) - 1];
			var msg = escapeSpecialCharacter(entry.element); 
			
			var view1 = $.UI.create('View',{
				classes: ['horz', 'wfill', 'hsize'],
				source :entry.id
			});
			
			var lbl1 = $.UI.create('Label',{
				text: "Type : " + elementType,
				source :entry.id,
				width:"80%",
				classes: ['hsize','vert','padding-top', 'padding', 'themeColor'],
			});
		 	var deleteImg = $.UI.create('ImageView',{
				image: "/images/cross.png",
				source :entry.id,
				type :entry.type,
				id : "deleteBtn",
				width: 15,
				height: 15
			});
			view1.add(lbl1);
			view1.add(deleteImg);
			view0.add(view1);
			deleteImg.addEventListener('click', deleteElement);
			if(entry.type == 1){
				var element1 = $.UI.create('Label',{
					text: msg,
					classes: ['hsize','wfill','padding','h6'],
					source :entry.id,
				}); 
				
				view0.add(element1);
			}
			
			if(entry.type == 2){
				var element2 = $.UI.create('Label',{
					text: textLimit(entry.element,120),
					classes: ['hsize','wfill','padding','h6'],
					source :entry.id,
				}); 
				  
				view0.add(element2);
			}
			
			if(entry.type == 3){
				var element3 = $.UI.create('ImageView',{
					image: entry.element,
					source :entry.id,
					classes: ['wsize','vert']
				});
			 	API.loadRemoteImage(element3,entry.element);    
				view0.add(element3); 
				
				var elementCaption = $.UI.create('Label',{
					text: textLimit(entry.caption,120),
					classes: ['hsize','wfill','padding','h6'],
					source :entry.id,
				}); 
				  
				view0.add(elementCaption);
				
				if(details.length != count){ 
					var viewLine = $.UI.create('View',{
						classes :['gray-line','padding-top']
					}); 
					view0.add(viewLine);
				}  
			} 
			
			view0.addEventListener('click', editElement);
			$.myContentView.add(view0); 
			
			count++;  
		});
	}else{
		var view1 = $.UI.create('View',{
			classes: ['horz', 'wfill', 'hsize'], 
			backgroundColor: "#ffffff"
		});
			
		var lbl1 = $.UI.create('Label',{
				text: 'Please click "+" to add sub title, paragraph or photo ' , 
				classes: ['hsize','vert','padding-top', 'padding', 'themeColor'],
		});
		view1.add(lbl1);
		$.myContentView.add(view1); 
	}
}

function editElement(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);     
	var isDel = res.id || "";
	if(isDel == "deleteBtn"){
		return false;
	}
	var win = Alloy.createController('editElement',{id: res.source, p_id: id,isCurriculum : isCurriculum}).getView();
	openModal(win);
} 

function deleteElement(e){
	var elbl = JSON.stringify(e.source); 
	var result = JSON.parse(elbl);    
	
	var dialog = Ti.UI.createAlertDialog({
	    cancel: 0,
	    buttonNames: ['Cancel','Confirm'],
	    message: 'Are you sure want to delete this element?',
	    title: 'Delete Records'
	});
	dialog.addEventListener('click', function(e){  
		if (e.index === e.source.cancel){
	      //Do nothing
	    }
	    if (e.index === 1){
	    	//delete element
	    	var param = {
				id  	: result.source,
			 	c_type  : result.type,
			 	isCurriculum: isCurriculum,
				session : Ti.App.Properties.getString('session')
			};
		 	 
			API.callByPost({url:"deleteElementUrl", params: param}, function(responseText){
				var res = JSON.parse(responseText);  
				if(res.status == "success"){  
					postElementModel.deletePostElement(result.source);  
					COMMON.resultPopUp("Delete Element", "Record successfully deleted");  
					refreshElement();
				}else{
					$.win.close();
					COMMON.hideLoading();
					Alloy.Globals.Navigator.open("login");
					COMMON.resultPopUp("Session Expired", res.data); 
				}
			});  
			 
	    }
	});
	dialog.show();  
}

$.home.addEventListener('click', function(){
	$.win.close();
	Ti.App.fireEvent('closeWindow');  
});

$.add.addEventListener('click', function(){
	var cancelBtn  = Alloy.Globals.ElementType.length -1;
	var dialog = Ti.UI.createOptionDialog({
		  cancel: Alloy.Globals.ElementType.length -1,
		  options: Alloy.Globals.ElementType, 
		  title: 'Choose To Add/Edit'
	});
		
	dialog.show();	 
	dialog.addEventListener("click", function(e){   
		if(cancelBtn != e.index){ 
			var eleType = parseInt(e.index) + 1;
			var win = Alloy.createController('editElement',{id: "", p_id: id,  elementType : eleType,isCurriculum : isCurriculum}).getView();
			openModal(win);
		}
	});
	
	
});

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
				 
			}  
			checker.updateModule(2,"curriculumPost", COMMON.now(), id);
			COMMON.hideLoading();
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.resultPopUp("Session Expired", res.data); 
		}
		
		showList(); 
	}, function(){
		// on error
		showList(); 
	});
}

function refreshElement(){  
	 console.log("trigger refreshElement!");
	COMMON.removeAllChildren($.myContentView);
	syncData();	
}

function closeWindow(){  
	Ti.App.removeEventListener('refreshElement', refreshElement); 
	$.win.close();
}

$.refresh.addEventListener('click', refreshElement);

Ti.App.addEventListener('refreshElement', refreshElement); 