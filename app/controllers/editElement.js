var args = arguments[0] || {};
var id = args.id || "";
var p_id=args.p_id || "";
var isCurriculum = args.isCurriculum || "";
var eleType =  args.elementType || ""; 
var details;
var postElementModel;
var element1;
var element2;
COMMON.construct($); 

init();

function init(){
	if(isCurriculum == "1"){
	 	postElementModel = Alloy.createCollection('curriculumPost_element');  
	}else{
		postElementModel = Alloy.createCollection('post_element');  
	}
	console.log("elementType : "+eleType);
	if(eleType != ""){
		console.log("a");
		newList();
	}else{
		console.log("b");
		showList();
	}
	
}

function newList(){
	$.deleteBtn.visible= false;
	var view0 = $.UI.create('View',{
		classes: ['vert', 'wfill', 'hsize','padding', 'box']
	});
		
	var elementType = Alloy.Globals.ElementType[parseInt(eleType) -1];
	 
	var lbl1 = $.UI.create('Label',{
		text: "Type : " + elementType,
		classes: ['hsize','vert','padding-top','padding', 'themeColor'],
	});
	
	if(eleType == 1){
		element1 = $.UI.create('TextField',{
			value: "",
			classes: ['hsize','wfill','padding'],
		}); 
		view0.add(lbl1);
		view0.add(element1);
	}
	
	if(eleType == 2){
		element2 = $.UI.create('TextArea',{
			value: "",
			classes: [ 'wfill','padding'],
			borderColor : "#f5f5f5",
			height:200
		});
		 
		view0.add(lbl1);
		view0.add(element2);
	}
	
	if( eleType == 3){
		var element3 = $.UI.create('ImageView',{
			image: "",
			classes: ['hsize','padding' ],
		});
	 	
	 	var element3a = $.UI.create('TextField',{
			hintText: "Photo Caption",
			classes: ['hsize','wfill','padding'],
		}); 
		view0.add(lbl1);
		view0.add(element3);
		view0.add(element3a);
		 
	}
			 
	$.editForm.add(view0);
}

function showList(){
	details = postElementModel.getRecordsById(id);
	//console.log(details);
	
	var view0 = $.UI.create('View',{
		classes: ['vert', 'wfill', 'hsize','padding', 'box'],
		source :details.id
	});
		
	var elementType = Alloy.Globals.ElementType[parseInt(details.type) - 1];
	var msg = escapeSpecialCharacter(details.element); 
	var lbl1 = $.UI.create('Label',{
		text: "Type : " + elementType,
		classes: ['hsize','vert','padding', 'themeColor'],
	});
	
	if(details.type == 1){
		element1 = $.UI.create('TextField',{
			value: msg,
			classes: ['hsize','wfill','padding'],
		}); 
		view0.add(lbl1);
		view0.add(element1);
	}
	
	if(details.type == 2){
		element2 = $.UI.create('TextArea',{
			value: msg,
			classes: ['hsize','wfill'],
			borderColor : "#f5f5f5"
		});
		 
		view0.add(lbl1);
		view0.add(element2);
	}
	
	if(details.type == 3){
		var element3 = $.UI.create('ImageView',{
			image: details.element,
			classes: ['hsize' ],
		});
	 	
	 	var element3a = $.UI.create('TextField',{
			value: details.caption,
			hintText: "Photo Caption",
			classes: ['hsize','wfill','padding-bottom'],
		}); 
		view0.add(lbl1);
		view0.add(element3);
		view0.add(element3a);
		 
	}
			 
	$.editForm.add(view0);
}

function save(){
	var id = details || "";
	
	if(id == ""){
		var param = {
			a_id    : p_id, 
			type    : eleType,
			element : element2.value,
			session : Ti.App.Properties.getString('session')
		};
		API.callByPost({url:"addElementUrl", params: param}, function(responseText){
			var res = JSON.parse(responseText);  
			if(res.status == "success"){ 
				var post_element_model = Alloy.createCollection('post_element');  
				post_element_model.addElement(res.data);  
				COMMON.createAlert("Saved", "Element successfully added"); 
			}else{
				$.win.close();
				COMMON.hideLoading();
				Alloy.Globals.Navigator.open("login");
				COMMON.createAlert("Session Expired", res.data); 
			}
		});
		
	}else{
		var param = {
			id  	: details.id,
			type    : details.type,
			element : element2.value,
			session : Ti.App.Properties.getString('session')
		};
		API.callByPost({url:"updateElementUrl", params: param}, function(responseText){
			var res = JSON.parse(responseText);  
			if(res.status == "success"){ 
				var post_element_model = Alloy.createCollection('post_element');  
				post_element_model.addElement(res.data);  
				COMMON.createAlert("Saved", "Element successfully updated"); 
			}else{
				$.win.close();
				COMMON.hideLoading();
				Alloy.Globals.Navigator.open("login");
				COMMON.createAlert("Session Expired", res.data); 
			}
		});
	}
	 
}

function deleteElement(){
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
				id  	: details.id,
			 	c_type  : details.type,
				session : Ti.App.Properties.getString('session')
			};
			API.callByPost({url:"deleteElementUrl", params: param}, function(responseText){
				var res = JSON.parse(responseText);  
				if(res.status == "success"){ 
					var post_element_model = Alloy.createCollection('post_element');  
					post_element_model.deletePostElement(details.id);  
					COMMON.createAlert("Delete Element", "Element successfully deleted"); 
					closeWindow();
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

function closeWindow(){
	Ti.App.fireEvent('refreshElement');  
	$.win.close();
}