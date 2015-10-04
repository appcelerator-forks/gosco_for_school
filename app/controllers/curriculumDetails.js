var args = arguments[0] || {};
var id = args.id || "";
COMMON.construct($); 
var curriculumModel = Alloy.createCollection('curriculum'); 
var curriculumPostModel = Alloy.createCollection('curriculumPost'); 
var curriculumPostElementModel = Alloy.createCollection('curriculumPost_element'); 
init();

function init(){
	var curriculum = curriculumModel.getCurriculumById(id);
	console.log(curriculum);
	$.thumbPreview.image = curriculum.img_path;	
	$.description.text   = curriculum.description;
	$.win.title = curriculum.curriculum; 
	showList();
	syncData();
}

function showList(){
	var list = curriculumPostModel.getLatestPostByCurriculum(id); 
	COMMON.hideLoading(); 
 	COMMON.removeAllChildren($.list);
	if(list.length > 0){ 
		var count = 0;
		list.forEach(function(entry) {
			var view0 = $.UI.create('View',{
				classes :['hsize' ],
				source :entry.id
			});
			
			var view1 = $.UI.create('View',{
				classes :['hsize', 'vert'],
				source :entry.id 
			});
			
			var label1 = $.UI.create('Label',{
				classes :['h5','hsize', 'wfill','themeColor', 'padding-left' ], 
				top:12,
				source :entry.id,
				text: entry.title
			});
			 
			var label2 = $.UI.create('Label',{
				classes :['h6', 'hsize','wfill','font_light_grey', 'padding-left','padding-bottom' ], 
				top:5,
				source :entry.id,
				text: entry.published_by + " at "+ timeFormat(entry.publish_date)
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
			
			if(list.length != count){
				var viewLine = $.UI.create('View',{
					classes :['gray-line']
				}); 
				$.list.add(label1);
			} 
			count++;
		});
	}else{
		var view0 = $.UI.create('View',{
			classes :['hsize' ], 
			selectedBackgroundColor : "#ffffff", 
		});
		var label1 = $.UI.create('Label',{
			classes :['h6','hsize', 'wfill','themeColor', 'padding' ],  
			text: "No record available"
		});
		view0.add(label1);	
		$.list.add(view0);
	}
}

function goDetails(e){
	var elbl = JSON.stringify(e.source); 
	var res = JSON.parse(elbl);     
	Alloy.Globals.Navigator.open('announcementDetails',{id: res.source, isCurriculum :1});
}

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
		console.log(res);
		if(res.status == "success"){  
			var postData = res.data; 
			if(postData != ""){ 
				var post = res.data.post;   
				curriculumPostModel.addPost(post);  
				curriculumPostElementModel.addElement(post);   
			}  
			checker.updateModule(2,"curriculumPost", COMMON.now(), id);
			showList();  
		}else{
			$.win.close();
			COMMON.hideLoading();
			Alloy.Globals.Navigator.open("login");
			COMMON.createAlert("Session Expired", res.data); 
		}
	});
}

function closeWindow(){
	$.win.close();
}

 