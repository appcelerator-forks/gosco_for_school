var args = arguments[0] || {};
var ImageLoader = require('imageLoader');    
var isCurriculum = args.isCurriculum || "";
var element_id = args.element_id  || ""; 
if(isCurriculum == "1"){  
	postEleModel = Alloy.createCollection('curriculumPost_element'); 
}else{  
	postEleModel = Alloy.createCollection('post_element'); 	
}
	
init();

function init(){ 
	showList();
}

function showList(){
	$.win.orientationModes = [ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT,Ti.UI.PORTRAIT,Ti.UI.UPSIDE_PORTRAIT ];
	var viewImage = postEleModel.getRecordsById(element_id);
	
	var itemImageView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE
	});
		
	adImage = Ti.UI.createImageView({
		//defaultImage: "/images/default.png",
		image: "",
		width:"100%",
		height: Ti.UI.SIZE 
	});
 
	ImageLoader.LoadRemoteImage(adImage,viewImage.element);  
	$.imageDetailsView.add(adImage);
	
}


/*********************
*** Event Listener ***
**********************/ 
$.closeView.addEventListener('click',function(e){
	$.win.close({
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		opacity: 0,
		duration: 200
	});
});
$.win.open();
