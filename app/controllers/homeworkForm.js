var args = arguments[0] || {};
COMMON.construct($); 
var h_id = args.id || "";
var homeworkModel = Alloy.createCollection('homework'); 
var subjectModel = Alloy.createCollection('subjects');
var educationClassModel = Alloy.createCollection('education_class');
var subject;
var classId;
init();

function init(){
	subject = subjectModel.getSubjectByUser(Ti.App.Properties.getString('u_id'), "");
	
	if(h_id != ""){
		var details = homeworkModel.getHomeworkById(h_id);
		classId =details.ec_id;
		var eduClass= educationClassModel.getEducationClassById(details.ec_id);
		$.class_value.text = eduClass.className;
		$.subject.value = details.subject;
		$.remark.value  = details.remark;
		$.expired_date.text = convertFromDBDateFormat(details.deadline);
		$.saveBtn.title= "Update Homework";
	}
}

function hideKeyboard(){ 
	$.remark.blur();
}

$.tvrClass.addEventListener('click', function(){
	var classList =educationClassModel.getEducationClassList(new Date().getFullYear() , Ti.App.Properties.getString('e_id'));
	 
	var classArr = []; 
	var classIdArr = [];
	classList.forEach(function(entry) {
		if(entry.state != ""){
			classArr.push(entry.className);
			classIdArr.push(entry.id);
		} 
	});
	classArr.push("Cancel"); 
	var cancelBtn = classArr.length -1;
	var dialog = Ti.UI.createOptionDialog({
		  cancel: classArr.length -1,
		  options: classArr, 
		  title: 'Choose Class'
	});
		
	dialog.show();	 
	dialog.addEventListener("click", function(e){   
		if(cancelBtn != e.index){ 
			$.class_value.text = classArr[e.index];
			classId  = classIdArr[e.index]; 
		}
	});
});

$.addSubject.addEventListener('click', function(){
	var subject = $.subject.value;
	if(subject.trim() != ""){ 
	 	var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: ['Cancel','Confirm'],
		    message: 'Are you sure want to add '+subject+'?',
		    title: 'Add subject'
		});
		dialog.addEventListener('click', function(e){ 
			if (e.index === e.source.cancel){
		      //Do nothing
		    }
		    if (e.index === 1){
		    	var param = {
					id : "",
					u_id : Ti.App.Properties.getString('u_id'),
					subject : subject.trim()
				};
				subjectModel.saveArray(param);
				COMMON.createAlert("Add Subject", "Added "+subject+" to my favourite list");
			} 
		});
		dialog.show();  
	} 
});

$.getSubject.addEventListener('click', function(){ 
	var subjectArr = []; 
	subject.forEach(function(entry) {
		if(entry.state != ""){
			subjectArr.push(entry.subject);
		} 
	});
	subjectArr.push("Cancel"); 
	var cancelBtn = subjectArr.length -1;
	var dialog = Ti.UI.createOptionDialog({
		  cancel: subjectArr.length -1,
		  options: subjectArr,
		  selectedIndex: 0,
		  title: 'Choose Subject'
	});
		
	dialog.show();	 
	dialog.addEventListener("click", function(e){   
		if(cancelBtn != e.index){ 
			$.subject.value = subjectArr[e.index];
		}
	});
});

function save(){
	classId = classId || ""; 
	var subject = $.subject.value;
	var remark = $.remark.value;
	var expired_date = $.expired_date.text;
	 
	if(subject.trim() == "" ){
		COMMON.createAlert("Add Fail","Please fill in subject");
		return false;
	}
	
	if(classId  == "" ){
		COMMON.createAlert("Add Fail","Please select a class");
		return false;
	}
	
	if(expired_date != ""){
		expired_date = convertToDBDateFormat(expired_date);
	}
	
	var param = { 
		"id" : h_id,
		"subject" : subject,
		"remark" : remark,
		"ec_id" : classId,
		"deadline" : expired_date,
		"status"  : 1,
		"session" : Ti.App.Properties.getString('session')
	};
	 
	API.callByPost({url:"addHomeworkUrl", params: param}, function(responseText){
		var res = JSON.parse(responseText); 
		
		if(res.status == "success"){   
			Ti.App.fireEvent('refreshShowList');  
			COMMON.createAlert("Create success","Successfully create homework!");
			closeWindow();  
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.createAlert("Session Expired", res.data); 
		}
	});
}

function changeExpiredDate(e){ 
	$.expired_date.text = dateConvert(e.value); 
}

function hideDatePicker(){
	$.dateExpiredPicker.visible = false; 
	$.dateToolbar.visible = false;
	$.selectorView.height = 0;
}

function showExpiredPicker(){  
	$.dateExpiredPicker.visible = true;
	$.dateToolbar.visible = true;
	$.selectorView.height = Ti.UI.SIZE;
}


function closeWindow(){ 
	
	$.win.close();
}
