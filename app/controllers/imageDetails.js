var args = arguments[0] || {};

var postEleModel = Alloy.createCollection('post_element'); 
var element_id = args.element_id  || "";

init();

function init(){
	showList();
}

function showList(){
	var viewImage = postEleModel.getRecordsById(element_id);
	
	var itemImageView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE
	});
		
	adImage = Ti.UI.createImageView({
		defaultImage: "/images/default.png",
		image: viewImage.element,
		width:"100%",
		height: Ti.UI.SIZE 
	});
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
