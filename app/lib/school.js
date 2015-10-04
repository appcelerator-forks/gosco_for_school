var mainView = null;

exports.construct = function(mv){
	mainView = mv;
};
exports.deconstruct = function(){  
	mainView = null;
};


function createOptions(title,options,onSelected){ 
	if(onSelected == null){
		onSelected= "0";
	}
	var cancelBtn = options.length-1;
	if(cancelBtn != onSelected){
		var myselected= options[onSelected];
	}
	 
	//School Level
	var theView = mainView.UI.create('View',{
		classes: [  'vert'],
		width:'33%', 
	});
	var theLabel = mainView.UI.create('Label',{
		classes: [ 'center', 'font_small', 'small_padding','font_light_white'], 
		text : title+" :",
		width:'100%', 
	});
	
	var theTextLabel = mainView.UI.create('Label',{
		classes: [ 'center', 'font_12','font_light_white'],
		text : myselected, 
		width:Ti.UI.SIZE, 
	});
	theView.add(theLabel);
	theView.add(theTextLabel);
	
	theView.addEventListener('click',function(){
		var dialog = Ti.UI.createOptionDialog({
		  cancel: options.length-1,
		  options: options,
		  selectedIndex: 0,
		  title: 'Filter By'
		});
		
		dialog.show();
		
		dialog.addEventListener("click", function(e){  
			 
			if(cancelBtn != e.index){
				theTextLabel.text = options[e.index]; 
				Ti.App.Properties.setString(title+'Pick', e.index);  
				Ti.App.fireEvent('filterList');
			}
		});
		
	});
	return theView;
}

exports.createOptions = function(title,options,onSelected){
	return createOptions(title,options,onSelected);
};
