// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var _ = require('underscore')._;
var API = require('api');
var COMMON = require('common'); 
var PUSH = require('push');
var DBVersionControl = require('DBVersionControl');


function separateLine(){
	return seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:Ti.UI.FILL, 
		width:1
	});
}


function dateConvert(date){
	var pickerdate = date; 
    var day = pickerdate.getDate();
    day = day.toString();
 
    if (day.length < 2) {
        day = '0' + day;
    }
  
    var month = pickerdate.getMonth();
    month = month + 1;
    month = month.toString();
 
    if (month.length < 2) {
        month = '0' + month;
    }
 
    var year = pickerdate.getFullYear(); 
    return day + "/" + month + "/" + year; 
}

function currentDateTime(){
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
} 

function monthFormat(date){
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
}

function textLimit(text, limit){ 
	text = text.replace(/<br\/>/g,"\r\n");
	text = text.replace(/\&quot;/g,"'");
	text = text.replace(/\\/g,'');
	
	if(text.length > 80){
		text = text.substring(0,limit ) + "..."; 
	}
	return text;
}

function timeFormat(datetime){
	var timeStamp = datetime.split(" ");  
	var newFormat;
	var ampm = "am";
	var date = timeStamp[0].split("-");  
	if(timeStamp.length == 1){
		newFormat = date[2]+"/"+date[1]+"/"+date[0] ;
	}else{
		var time = timeStamp[1].split(":");  
		if(time[0] > 12){
			ampm = "pm";
			time[0] = time[0] - 12;
		}
		
		newFormat = date[2]+"/"+date[1]+"/"+date[0] + " "+ time[0]+":"+time[1]+ " "+ ampm;
	}
	
	return newFormat;
}

function convertToDBDateFormat(datetime){
	var timeStamp = datetime.split(" ");  
	var newFormat;
	 
	var date = timeStamp[0].split("/");  
	if(timeStamp.length == 1){
		newFormat = date[2]+"-"+date[1]+"-"+date[0] ;
	}else{
		 
		newFormat = date[2]+"-"+date[1]+"-"+date[0] + " "+ timeStamp[1];
	}
	
	return newFormat;
}

function convertFromDBDateFormat(datetime){
	var timeStamp = datetime.split(" ");  
	var newFormat;
	 
	var date = timeStamp[0].split("-");  
	if(timeStamp.length == 1){
		newFormat = date[2]+"/"+date[1]+"/"+date[0] ;
	}else{
		 
		newFormat = date[2]+"/"+date[1]+"/"+date[0] + " "+ timeStamp[1];
	}
	
	return newFormat;
}


function escapeSpecialCharacter(msg){ 
	msg = msg.replace(/<br\/>/g,"\r\n");
	msg = msg.replace(/\&quot;/g,"'");
	msg = msg.replace(/\\/g,'');
	return msg;
}

function openModal(win,payload){   
	if(OS_IOS){
		win.open({
			modal:true
		}, payload);
	}else{
		// added this property to the payload to know if the window is a child 
		win.open({navBarHidden: false, fullscreen: false}, payload);
	}
};

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

Alloy.Globals.SchoolLevel =  [ 'Primary School', 'Secondary School', 'College'];
Alloy.Globals.SchoolType =  [ 'Kebangsaan', 'Jenis Kebangsaan', 'Private/International' ];
Alloy.Globals.SchoolState =  [ 'Kuala Lumpur','Selangor' ];
Alloy.Globals.StaffStatus =  [ 'Active','On Leave', 'Resign' ];
Alloy.Globals.StaffRoles =  [ 'headmaster','teacher', 'admin' ];
Alloy.Globals.ElementType =  [ 'Sub Title','Paragraph', 'Photo' ,'Cancel' ];
