var mainView = null;

exports.construct = function(mv){
	mainView = mv;
};
exports.deconstruct = function(){  
	mainView = null;
};


exports.hideLoading = function(){
	mainView.activityIndicator.hide();
	mainView.loadingBar.opacity = "0";
	mainView.loadingBar.height = "0";
//	mainView.loadingBar.top = "0"; 
};

exports.showLoading = function(){ 
	mainView.activityIndicator.show();
	mainView.loadingBar.opacity = 1;
	mainView.loadingBar.zIndex = 100;
	mainView.loadingBar.height = 120;
	 
	if(Ti.Platform.osname == "android"){
	//	mainView.loadingBar.top =  (DPUnitsToPixels(Ti.Platform.displayCaps.platformHeight) / 2) -50; 
		mainView.activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG;
		//mainView.activityIndicator.top = 0; 
	}else if (Ti.Platform.name === 'iPhone OS'){
		//mainView.loadingBar.top = (Ti.Platform.displayCaps.platformHeight / 2) -50; 
		mainView.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	}  
};

exports.displayHTMLArticle = function(msg){
	var str = '<html  style=" overflow: hidden;">';
	str += '<head>';
	str += '<meta name="viewport" content="user-scalable=0">';
	str += '<script src="jquery.min.js"></script>';
	str += '<style>';
	str += 'html{ -webkit-user-select: none}';
	str += 'a{ text-decoration:none;color:"#EABD2A"} ';
	str += '</style>';
	str += '</head>';
	str += '<body style="overflow: hidden;font-size:14px;color:#676767; font-family:arial;">';
	str += '<div id="myContent" style="">'+msg; 
	str += '</div>';
	str += '</body>';
	str += '</html>';
	str += '<script> ';
	str += 'var contentHeight = $( "div" ).height();';
	str += '$("html").css("height", contentHeight + 10);';
	str += ' $("body").css("height", contentHeight);';
	str += '</script>'; 
	if (OS_IOS) {
		return Ti.UI.createWebView({ 
			html: str,
			width : Ti.UI.FILL,
			height: Ti.UI.SIZE,  
		}) ; 
	}else{
		return Ti.UI.createWebView({ 
			html: str,
			enableZoomControls : false,
			overScrollMode : Titanium.UI.Android.OVER_SCROLL_IF_CONTENT_SCROLLS,
			width : Ti.UI.FILL,
			height: Ti.UI.SIZE,  
		}) ; 
	}
	
};


exports.showLoadingFull = function(){ 
	var loadingBarView = Ti.UI.createView({
		layout: "vertical",
		height: 120,
		width: 120,
		borderRadius: 15,
		backgroundColor: "#2E2E2E",
		id:"loadingBar",
		zIndex:99
	});
	var activityIndicator = Ti.UI.createActivityIndicator({    
	  top:30,
	  left:30,
	  width:60, 
	});
	if(Ti.Platform.osname == "android"){ 
		activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG; 
	}else if (Ti.Platform.name === 'iPhone OS'){ 
		activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	}  
	activityIndicator.show();
	var loadingLabel = Ti.UI.createLabel({
		top:5,
		text : "Loading ...",
		color: "#ffffff"
	});
	loadingBarView.add(activityIndicator);
	loadingBarView.add(loadingLabel);
	
	return loadingBarView;
};

exports.noRecord = function(){
	var data = [];
	var row = Titanium.UI.createTableViewRow({
		touchEnabled: false, 
		backgroundColor: 'transparent' 
	});
		 
	var tblView = Ti.UI.createView({
		height: 'auto'//parseInt(Ti.Platform.displayCaps.platformHeight) -100
	}); 

	var noRecord = Ti.UI.createLabel({ 
		text: "No record found", 
		color: '#375540', 
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		 font:{fontSize:14,fontStyle:'italic'},
		top: 15,
		width: "100%"
	});
	tblView.add(noRecord); 
	row.add(tblView); 
	data.push(row);
	return data;
};

function openWindow(win){
	if(Ti.Platform.osname == "android"){
	  	win.open(); //{fullscreen:false, navBarHidden: false}
	}else{ 
		var nav = Alloy.Globals.navWin; 
		nav.openWindow(win,{animated:true});  
	} 
}


//function closeWindow(win){
exports.closeWindow = function(win){
	/**if(Ti.Platform.osname == "android"){ 
	  	win.close(); 
	}else{ 
		var nav = Alloy.Globals.navWin;
		nav.closeWindow(win,{animated:true});  
	} **/
	win.close(); 
};

function removeAllChildren (viewObject){
    //copy array of child object references because view's "children" property is live collection of child object references
    var children = viewObject.children.slice(0);
 
    for (var i = 0; i < children.length; ++i) {
        viewObject.remove(children[i]);
    }
};

function createAlert (tt,msg){
	var box = Titanium.UI.createAlertDialog({
		title: tt,
		ok: 'OK',
		message: msg
	});
	box.show();
};

exports.openWindow = _.throttle(openWindow, 500, true);
//exports.closeWindow = _.debounce(closeWindow, 0, true);
exports.removeAllChildren = function(view){
	removeAllChildren(view);
};
 
exports.createAlert = _.throttle(createAlert, 500, true);

/***Date Time related and format***/
exports.now = function(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var sec = today.getSeconds();
	if (minutes < 10){
		minutes = "0" + minutes;
	} 
	if (sec < 10){
		sec = "0" + sec;
	} 
	if(dd<10) {
	    dd='0'+dd;
	} 
	
	if(mm<10) {
	    mm='0'+mm;
	} 
	
	datetime = yyyy+'-'+mm+'-'+dd + " "+ hours+":"+minutes+":"+sec;
	return datetime ;
};

exports.monthFormat = function(date){
	var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
 
    var day = date.split('-'); 
    if(day[1] == "08"){
		day[1] = "8";
	}
	if(day[1] == "09"){
		day[1] = "9";
	}
    month = parseInt(day[1]) -1; 
    return day[2]+" "+ monthNames[month]+" "+ day[0];
};

exports.timeFormat = function(datetime){
	var timeStamp = datetime.split(" ");  
	var newFormat;
	var ampm = "am";
	var date = timeStamp[0].split("-");  
	var time = timeStamp[1].split(":");  
	if(time[0] > 12){
		ampm = "pm";
		time[0] = time[0] - 12;
	}
	
	newFormat = date[2]+"/"+date[1]+"/"+date[0] + " "+ time[0]+":"+time[1]+ " "+ ampm;
	return newFormat;
};

exports.modalView = function(title, contentView){ 
		var myModal = Ti.UI.createWindow({
			title	: title,
			backgroundColor : '#FFFFFF',
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			navBarHidden : true,
			fullscreen	 :true
		});
		var leftBtn = Ti.UI.createButton({
			title: "Close",
			color: "#10844D",
			left: 10,
			top: 5,
		});
		
	 
		var loadingBarView = COMMON.showLoadingFull();
		myModal.add(loadingBarView);
		var wrapperView    = Ti.UI.createView({
			layout:"vertical",
			height: Ti.UI.FILL
		}); 
		// Full screen
		var topView = Ti.UI.createView({  // Also full screen
		    backgroundColor : '#EEEEEE',
		    top         : 0,
		    layout		: "horizontal",
		    height		: 40
		}); 
		
		var viewLabel = Ti.UI.createView({  // Also full screen
		   	width 		: Ti.UI.FILL, 
		    height		: 40 
		}); 
		
		var titleLabel = Ti.UI.createLabel({
			height: Ti.UI.SIZE,
			width : Ti.UI.FILL,
			textAlign : "center",
			top: 10,
			color: "#646464",
			text: 	title,
		});
		viewLabel.add(titleLabel);
		var containerView  = Ti.UI.createView({  // Set height appropriately
		    height          : Ti.UI.FILL,
		    width			: Ti.UI.FILL,
		    
		});
		  
		topView.add(leftBtn); 
		topView.add(viewLabel); 
		containerView.add(contentView); 
		wrapperView.add(topView);
	 	
		wrapperView.add(containerView); 
		myModal.add(wrapperView); 
		myModal.open({
			modal : true
		});
		leftBtn.addEventListener('click',function(ex){
			myModal.close({animated: true});
			loadingBarView = null;
		});		
		
	return loadingBarView;
};


exports.resultPopUp = function(title, msg){
	var mask = Titanium.UI.createView({
		width: "100%",
		height: "100%",
		zIndex: 999,
		backgroundColor: "#000",
		opacity:0.45,
	});
	
	var box = mainView.UI.create('View',{
		classes : ['hsize','vert'],
		width: "90%", 
		opacity:1.0,zIndex: 1999,
	});
	var header = mainView.UI.create('View',{
		classes: ['themeBg', 'wfill','hsize'] 
	});
	var head_title = mainView.UI.create('Label',{
		text: title,
		classes: ['padding'],
		color: "#ffffff", 
	});
	header.add(head_title);
	var content = mainView.UI.create('View',{
		classes : ['hsize','wfill','vert'], 
		backgroundColor: "#fff", 
	});
	var content_text = mainView.UI.create('Label',{
		classes : ['hsize','wfill','padding'], 
		text: msg 
	});
	
	var btnView = mainView.UI.create('View',{
		classes : ['hsize','wfill'],  
		backgroundColor: "#fff", 
		textAlign: 'center' 
	});
	var okButton = Ti.UI.createButton({ 
		title: "OK",
		width: "30%",
		backgroundColor: "#F1F1F1",
		borderColor: "#10844D",
		color: "#10844D",
		borderRadius: 10,
		height: Ti.UI.SIZE,
		bottom: "20dp",
	});
	 
	btnView.add(okButton); 
	content.add(content_text);
	content.add(btnView);
	box.add(header);
	box.add(content); 
	mainView.win.add(box);
	mainView.win.add(mask);
	okButton.addEventListener("click", function(){
		mainView.win.remove(box);
		mainView.win.remove(mask);
	}); 
};
