var args = arguments[0] || {};
COMMON.construct($);
COMMON.showLoading();
var subjectsModel = Alloy.createCollection('subjects'); 
var detail;
var searchKey;
init();

function init(){ 
	showList();
}

function showList(){
	searchKey = searchKey || "";
	result = subjectsModel.getSubjectByUser(Ti.App.Properties.getString('u_id'), searchKey);
	COMMON.removeAllChildren($.table);
	if(result.length > 0){
		var count = 1; 
		result.forEach(function(entry) {
			var view1 = $.UI.create('View',{
				classes :['hsize' ],
				source:entry.id, 
				text:entry.subject, 
			});
			
			var label1 = $.UI.create('Label',{
				classes :['h5','hsize', 'wfill','themeColor', 'padding' ],  
				source:entry.id,
				text: entry.subject
			});
			var imgView1 = $.UI.create('ImageView',{
				image : "/images/remove.png",
				text:entry.subject, 
				source :entry.id,
				width : 20,
				height : 20,
				right: 10
			});
			view1.add(label1);
			view1.add(imgView1);
			imgView1.addEventListener('click', removeSubject);
			$.table.add(view1);
			if(result.length != count){
				var viewLine = $.UI.create('View',{
					classes :['gray-line']
				}); 
				$.table.add(viewLine);
			}
			
			count++;
		});
	}else{
		$.table.add($.UI.create('Label',{
			classes :['h5','hsize', 'wfill','themeColor', 'padding' ],  
			text: "No subject at the moment"
		}));
	}
	COMMON.hideLoading();
}

function removeSubject(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);   
	var dialog = Ti.UI.createAlertDialog({
	    cancel: 1,
	    buttonNames: ['Cancel','Confirm'],
	    message: 'Are you sure want to delete '+res.text+'?',
	    title: 'Delete subject'
	});
	dialog.addEventListener('click', function(e){
	  
		if (e.index === e.source.cancel){
	      //Do nothing
	    }
	    if (e.index === 1){
	    	 subjectsModel.removeSubject({id:res.source });
	    	 showList();
	    }
	});
	dialog.show();  
}

function save(){
	var subject = $.newSubjects.value;
	if(subject.trim() != ""){
		COMMON.showLoading();
		var param = {
			id : "",
			u_id : Ti.App.Properties.getString('u_id'),
			subject : subject.trim()
		};
		subjectsModel.saveArray(param);
		showList();
		$.newSubjects.value="";
	}
}

function closeWindow(){
	$.win.close();
}


function addNew(){    
	var isVis=  $.addForm.getVisible(); 
	if(isVis === true){ 
		$.addForm.visible = false;
		$.addForm.height = 0;
		$.newSubjects.blur();
	}else{ 
		$.addForm.visible = true;
		$.addForm.height = 50;
		$.newSubjects.focus();
	}
} 