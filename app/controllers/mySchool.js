var args = arguments[0] || {};
COMMON.construct($); 
var educationAdminModel = Alloy.createCollection('education_admin'); 
var educationModel = Alloy.createCollection('education'); 
var result = educationAdminModel.getEducationByUser(2015, Ti.App.Properties.getString('u_id'));
 
init();

function init(){ 
	if(result.length > 0){
		var count = 1; 
		result.forEach(function(entry) {
			var school = educationModel.getSchoolById(entry.e_id);
			
			var view1 = $.UI.create('View',{
				classes :['hsize', 'vert'],
				selectedBackgroundColor : "#ffffff", 
			});
			
			var label1 = $.UI.create('Label',{
				classes :['h5','hsize', 'wfill','themeColor', 'padding-left' ], 
				top:12,
				text: school.name
			});
			
			var schoolLevel = Alloy.Globals.SchoolLevel[parseInt(school.level) - 1];
			
			var label2 = $.UI.create('Label',{
				classes :['h6', 'hsize','wfill','font_light_grey', 'padding-left','padding-bottom' ], 
				top:5,
				text: schoolLevel + " on year "+ entry.year
			});
			
			
			view1.add(label1);
			view1.add(label2);
			$.table.add(view1);
			
			if(result.length != count){
				var viewLine = $.UI.create('View',{
					classes :['gray-line']
				}); 
				$.table.add(viewLine);
			}
			
			count++;
		});
	}
}

function closeWindow(){
	$.win.close();
}
