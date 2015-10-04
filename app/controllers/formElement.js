var args = arguments[0] || {};
 
var isCurriculum = args.isCurriculum || "";
var id = args.id || "";
var details;
COMMON.construct($); 

init();

function init(){
	if(isCurriculum == "1"){
	 	postElementModel = Alloy.createCollection('curriculumPost_element');  
	}else{
		postElementModel = Alloy.createCollection('post_element');  
	}
	
	
	showList();
}

function showList(){
	details = postElementModel.getListByPost(id);  
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
		 	  
			view0.add(element3); 
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
}

function editElement(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);    
	var win = Alloy.createController('editElement',{id: res.source, p_id: id,isCurriculum : isCurriculum}).getView();
	openModal(win);
}
 

function closeWindow(){ 
	Ti.App.removeEventListener('refreshElement', refreshElement); 
	$.win.close();
}


function deleteElement(e){
	var elbl = JSON.stringify(e.source); 
	var result = JSON.parse(elbl);    
	
	var dialog = Ti.UI.createAlertDialog({
	    cancel: 0,
	    buttonNames: ['Cancel','Confirm'],
	    message: 'Are you sure want to delete this element?',
	    title: 'Delete Element'
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
				session : Ti.App.Properties.getString('session')
			};
		 
			API.callByPost({url:"deleteElementUrl", params: param}, function(responseText){
				var res = JSON.parse(responseText);  
				if(res.status == "success"){ 
					var post_element_model = Alloy.createCollection('post_element');  
					post_element_model.deletePostElement(result.source);  
					COMMON.createAlert("Delete Element", "Element successfully deleted");  
					refreshElement();
				}else{
					$.win.close();
					COMMON.hideLoading();
					Alloy.Globals.Navigator.open("login");
					COMMON.createAlert("Session Expired", res.data); 
				}
			});  
			 
	    }
	});
	dialog.show(); 
}

$.add.addEventListener('click', function(){
	  
	var cancelBtn = Alloy.Globals.ElementType.length -1;
	var dialog = Ti.UI.createOptionDialog({
		  cancel: Alloy.Globals.ElementType.length -1,
		  options: Alloy.Globals.ElementType, 
		  title: 'Choose Element Type'
	});
		
	dialog.show();	 
	dialog.addEventListener("click", function(e){   
		if(cancelBtn != e.index){  
			console.log( e.index); 
			var eleType = parseInt(e.index) + 1;
			var win = Alloy.createController('editElement',{id: "", p_id: id,  elementType : eleType,isCurriculum : isCurriculum}).getView();
			openModal(win);
		}
	});
	
	
});

function refreshElement(){  
	COMMON.removeAllChildren($.myContentView);
	showList();	
}

$.refresh.addEventListener('click', refreshElement);

Ti.App.addEventListener('refreshElement', refreshElement); 